#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    Vec, String, Address, Env, Symbol, symbol_short,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ProjectStatus {
    Open,
    InProgress,
    Completed,
    Cancelled,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MilestoneStatus {
    Pending,
    Funded,
    Submitted,
    Approved,
    Paid,
}

#[contracttype]
#[derive(Clone)]
pub struct Project {
    pub id: u64,
    pub client: Address,
    pub freelancer: Option<Address>,
    pub title: String,
    pub description: String,
    pub total_milestones: u32,
    pub status: ProjectStatus,
    pub created_at: u64,
    pub updated_at: u64,
}

#[contracttype]
#[derive(Clone)]
pub struct Milestone {
    pub id: u64,
    pub project_id: u64,
    pub title: String,
    pub description: String,
    pub amount: i128,
    pub status: MilestoneStatus,
    pub delivery_hash: Option<soroban_sdk::BytesN<32>>,
    pub created_at: u64,
    pub updated_at: u64,
}

#[contracttype]
#[derive(Clone)]
pub struct MilestoneInput {
    pub title: String,
    pub description: String,
    pub amount: i128,
}

#[contracttype]
pub enum DataKey {
    Project(u64),
    Milestone(u64, u64),
    ProjectCounter,
    ClientProjects(Address),
    FreelancerProjects(Address),
}

#[contract]
pub struct FreelancerMilestone;

#[contracterror]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ContractError {
    ProjectNotFound = 1,
    MilestoneNotFound = 2,
    Unauthorized = 3,
    ProjectNotOpen = 4,
    ProjectNotInProgress = 5,
    CannotSelfAccept = 6,
    MilestoneNotPending = 7,
    MilestoneNotFunded = 8,
    MilestoneNotSubmitted = 9,
    MilestoneNotApproved = 10,
    ProjectNotCancellable = 11,
    DuplicateFreelancer = 12,
}

const PRJ_CREATED: Symbol = symbol_short!("prj_cre");
const PRJ_ACCEPTED: Symbol = symbol_short!("prj_acc");
const MLS_FUNDED: Symbol = symbol_short!("mls_fnd");
const MLS_SUBMITTED: Symbol = symbol_short!("mls_sub");
const MLS_APPROVED: Symbol = symbol_short!("mls_app");
const PAY_RELEASED: Symbol = symbol_short!("pay_rel");
const PRJ_CANCELLED: Symbol = symbol_short!("prj_can");
const PRJ_DELETED: Symbol = symbol_short!("prj_del");

#[contractimpl]
impl FreelancerMilestone {
    pub fn create_project(
        env: Env,
        client: Address,
        title: String,
        description: String,
        milestones: Vec<MilestoneInput>,
    ) -> u64 {
        client.require_auth();

        let count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::ProjectCounter)
            .unwrap_or(0);
        let project_id = count + 1;

        for (i, milestone) in milestones.iter().enumerate() {
            let ms_id = project_id * 1000 + 1 + i as u64;
            let ms = Milestone {
                id: ms_id,
                project_id,
                title: milestone.title.clone(),
                description: milestone.description.clone(),
                amount: milestone.amount,
                status: MilestoneStatus::Pending,
                delivery_hash: None,
                created_at: env.ledger().timestamp(),
                updated_at: env.ledger().timestamp(),
            };
            env.storage()
                .instance()
                .set(&DataKey::Milestone(project_id, ms_id), &ms);
        }

        let project = Project {
            id: project_id,
            client: client.clone(),
            freelancer: None,
            title: title.clone(),
            description: description.clone(),
            total_milestones: milestones.len() as u32,
            status: ProjectStatus::Open,
            created_at: env.ledger().timestamp(),
            updated_at: env.ledger().timestamp(),
        };

        env.storage()
            .instance()
            .set(&DataKey::Project(project_id), &project);
        env.storage()
            .instance()
            .set(&DataKey::ProjectCounter, &project_id);

        let mut client_projects: Vec<u64> = env
            .storage()
            .instance()
            .get(&DataKey::ClientProjects(client.clone()))
            .unwrap_or_else(|| Vec::new(&env));
        client_projects.push_back(project_id);
        env.storage()
            .instance()
            .set(&DataKey::ClientProjects(client.clone()), &client_projects);

        env.events().publish((PRJ_CREATED, client, title), project_id);

        project_id
    }

    pub fn accept_project(env: Env, project_id: u64, freelancer: Address) {
        freelancer.require_auth();

        let mut project = Self::get_project_or_err(&env, project_id);

        if project.status != ProjectStatus::Open {
            panic!("ProjectNotOpen");
        }
        if project.client == freelancer {
            panic!("CannotSelfAccept");
        }
        if project.freelancer.is_some() {
            panic!("DuplicateFreelancer");
        }

        project.freelancer = Some(freelancer.clone());
        project.status = ProjectStatus::InProgress;
        project.updated_at = env.ledger().timestamp();
        env.storage()
            .instance()
            .set(&DataKey::Project(project_id), &project);

        let mut fl_projects: Vec<u64> = env
            .storage()
            .instance()
            .get(&DataKey::FreelancerProjects(freelancer.clone()))
            .unwrap_or_else(|| Vec::new(&env));
        fl_projects.push_back(project_id);
        env.storage()
            .instance()
            .set(
                &DataKey::FreelancerProjects(freelancer.clone()),
                &fl_projects,
            );

        env.events().publish((PRJ_ACCEPTED, freelancer, project_id), ());
    }

    pub fn deposit_milestone(
        env: Env,
        client: Address,
        project_id: u64,
        milestone_id: u64,
    ) {
        client.require_auth();

        let project = Self::get_project_or_err(&env, project_id);
        let mut milestone = Self::get_milestone_or_err(&env, project_id, milestone_id);

        if project.client != client {
            panic!("Unauthorized");
        }
        if milestone.status != MilestoneStatus::Pending {
            panic!("MilestoneNotPending");
        }

        milestone.status = MilestoneStatus::Funded;
        milestone.updated_at = env.ledger().timestamp();
        env.storage()
            .instance()
            .set(&DataKey::Milestone(project_id, milestone_id), &milestone);

        env.events()
            .publish((MLS_FUNDED, client, milestone_id), milestone.amount);
    }

    pub fn submit_milestone(
        env: Env,
        project_id: u64,
        milestone_id: u64,
        delivery_hash: soroban_sdk::BytesN<32>,
    ) {
        let project = Self::get_project_or_err(&env, project_id);
        let mut milestone = Self::get_milestone_or_err(&env, project_id, milestone_id);

        if let Some(ref freelancer) = project.freelancer {
            freelancer.require_auth();
        } else {
            panic!("ProjectNotInProgress");
        }

        if milestone.status != MilestoneStatus::Funded {
            panic!("MilestoneNotFunded");
        }

        milestone.status = MilestoneStatus::Submitted;
        milestone.delivery_hash = Some(delivery_hash);
        milestone.updated_at = env.ledger().timestamp();
        env.storage()
            .instance()
            .set(&DataKey::Milestone(project_id, milestone_id), &milestone);

        env.events().publish((MLS_SUBMITTED, project_id, milestone_id), ());
    }

    pub fn approve_milestone(env: Env, project_id: u64, milestone_id: u64) {
        let project = Self::get_project_or_err(&env, project_id);
        let mut milestone = Self::get_milestone_or_err(&env, project_id, milestone_id);

        project.client.require_auth();

        if milestone.status != MilestoneStatus::Submitted {
            panic!("MilestoneNotSubmitted");
        }

        milestone.status = MilestoneStatus::Approved;
        milestone.updated_at = env.ledger().timestamp();
        env.storage()
            .instance()
            .set(&DataKey::Milestone(project_id, milestone_id), &milestone);

        env.events()
            .publish((MLS_APPROVED, project_id, milestone_id), ());
    }

    pub fn release_payment(env: Env, project_id: u64, milestone_id: u64) {
        let _project = Self::get_project_or_err(&env, project_id);
        let mut milestone = Self::get_milestone_or_err(&env, project_id, milestone_id);

        if milestone.status != MilestoneStatus::Approved {
            panic!("MilestoneNotApproved");
        }

        milestone.status = MilestoneStatus::Paid;
        milestone.updated_at = env.ledger().timestamp();
        env.storage()
            .instance()
            .set(&DataKey::Milestone(project_id, milestone_id), &milestone);

        env.events()
            .publish((PAY_RELEASED, project_id, milestone_id), milestone.amount);
    }

    pub fn delete_project(env: Env, client: Address, project_id: u64) {
        client.require_auth();

        let project = Self::get_project_or_err(&env, project_id);

        if project.client != client {
            panic!("Unauthorized");
        }

        env.storage().instance().remove(&DataKey::Project(project_id));

        for i in 0..project.total_milestones {
            let ms_id = project_id * 1000 + 1 + i as u64;
            env.storage()
                .instance()
                .remove(&DataKey::Milestone(project_id, ms_id));
        }

        let curr: Vec<u64> = env
            .storage()
            .instance()
            .get(&DataKey::ClientProjects(client.clone()))
            .unwrap_or_else(|| Vec::new(&env));
        let mut filtered: Vec<u64> = Vec::new(&env);
        for id in curr.iter() {
            if id != project_id {
                filtered.push_back(id);
            }
        }
        env.storage()
            .instance()
            .set(&DataKey::ClientProjects(client.clone()), &filtered);

        if let Some(ref freelancer) = project.freelancer {
            let fl_projects: Vec<u64> = env
                .storage()
                .instance()
                .get(&DataKey::FreelancerProjects(freelancer.clone()))
                .unwrap_or_else(|| Vec::new(&env));
            let mut filtered_fl: Vec<u64> = Vec::new(&env);
            for id in fl_projects.iter() {
                if id != project_id {
                    filtered_fl.push_back(id);
                }
            }
            env.storage()
                .instance()
                .set(
                    &DataKey::FreelancerProjects(freelancer.clone()),
                    &filtered_fl,
                );
        }

        env.events()
            .publish((PRJ_DELETED, client, project_id), ());
    }

    pub fn cancel_project(env: Env, project_id: u64) {
        let mut project = Self::get_project_or_err(&env, project_id);

        project.client.require_auth();

        if project.status != ProjectStatus::Open {
            panic!("ProjectNotCancellable");
        }

        project.status = ProjectStatus::Cancelled;
        project.updated_at = env.ledger().timestamp();
        env.storage()
            .instance()
            .set(&DataKey::Project(project_id), &project);

        env.events()
            .publish((PRJ_CANCELLED, project.client.clone(), project_id), ());
    }

    pub fn get_project(env: Env, project_id: u64) -> Project {
        Self::get_project_or_err(&env, project_id)
    }

    pub fn get_milestone(env: Env, project_id: u64, milestone_id: u64) -> Milestone {
        Self::get_milestone_or_err(&env, project_id, milestone_id)
    }

    pub fn get_client_projects(env: Env, client: Address) -> Vec<u64> {
        env.storage()
            .instance()
            .get(&DataKey::ClientProjects(client))
            .unwrap_or_else(|| Vec::new(&env))
    }

    pub fn get_freelancer_projects(env: Env, freelancer: Address) -> Vec<u64> {
        env.storage()
            .instance()
            .get(&DataKey::FreelancerProjects(freelancer))
            .unwrap_or_else(|| Vec::new(&env))
    }

    pub fn get_project_milestones(env: Env, project_id: u64) -> Vec<Milestone> {
        let project = Self::get_project_or_err(&env, project_id);
        let mut milestones = Vec::new(&env);
        for i in 0..project.total_milestones {
            let ms_id = project_id * 1000 + 1;
            if let Some(ms) = env
                .storage()
                .instance()
                .get(&DataKey::Milestone(project_id, ms_id + i as u64))
            {
                milestones.push_back(ms);
            }
        }
        milestones
    }

    pub fn get_project_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::ProjectCounter)
            .unwrap_or(0)
    }
}

impl FreelancerMilestone {
    fn get_project_or_err(env: &Env, project_id: u64) -> Project {
        env.storage()
            .instance()
            .get(&DataKey::Project(project_id))
            .unwrap_or_else(|| panic!("ProjectNotFound"))
    }

    fn get_milestone_or_err(env: &Env, project_id: u64, milestone_id: u64) -> Milestone {
        env.storage()
            .instance()
            .get(&DataKey::Milestone(project_id, milestone_id))
            .unwrap_or_else(|| panic!("MilestoneNotFound"))
    }
}

#[cfg(test)]
mod test;
