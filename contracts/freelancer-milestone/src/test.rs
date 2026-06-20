#![cfg(test)]

use super::*;
use soroban_sdk::{vec, Env, String, Address, testutils::Address as _};

fn create_milestone_input(env: &Env, title: &str, description: &str, amount: i128) -> MilestoneInput {
    MilestoneInput {
        title: String::from_str(env, title),
        description: String::from_str(env, description),
        amount,
    }
}

fn deploy_contract(env: &Env) -> (Address, Address, Address) {
    let contract_id = env.register_contract(None, FreelancerMilestone);
    let client = Address::generate(env);
    let freelancer = Address::generate(env);
    (contract_id, client, freelancer)
}

#[test]
fn test_create_project() {
    let env = Env::default();
    env.mock_all_auths();
    let (contract_id, client, _) = deploy_contract(&env);

    let milestones = vec![
        &env,
        create_milestone_input(&env, "Design", "Design the UI", 1_000_0000),
        create_milestone_input(&env, "Develop", "Build the app", 2_000_0000),
    ];

    let project_id = FreelancerMilestoneClient::new(&env, &contract_id)
        .create_project(&client, &String::from_str(&env, "Test Project"), &String::from_str(&env, "A test project"), &milestones);

    assert_eq!(project_id, 1);

    let project = FreelancerMilestoneClient::new(&env, &contract_id)
        .get_project(&project_id);

    assert_eq!(project.title, String::from_str(&env, "Test Project"));
    assert_eq!(project.status, ProjectStatus::Open);
    assert_eq!(project.total_milestones, 2);
}

#[test]
fn test_accept_project() {
    let env = Env::default();
    env.mock_all_auths();
    let (contract_id, client_addr, freelancer) = deploy_contract(&env);

    let milestones = vec![
        &env,
        create_milestone_input(&env, "Design", "Design phase", 1_000_0000),
    ];

    let project_id = FreelancerMilestoneClient::new(&env, &contract_id)
        .create_project(&client_addr, &String::from_str(&env, "Project"), &String::from_str(&env, "Desc"), &milestones);

    FreelancerMilestoneClient::new(&env, &contract_id)
        .accept_project(&project_id, &freelancer);

    let project = FreelancerMilestoneClient::new(&env, &contract_id)
        .get_project(&project_id);

    assert_eq!(project.status, ProjectStatus::InProgress);
}

#[test]
fn test_cancel_project() {
    let env = Env::default();
    env.mock_all_auths();
    let (contract_id, client_addr, _) = deploy_contract(&env);

    let milestones = vec![
        &env,
        create_milestone_input(&env, "Phase 1", "First phase", 1_000_0000),
    ];

    let project_id = FreelancerMilestoneClient::new(&env, &contract_id)
        .create_project(&client_addr, &String::from_str(&env, "Project"), &String::from_str(&env, "Desc"), &milestones);

    FreelancerMilestoneClient::new(&env, &contract_id)
        .cancel_project(&project_id);

    let project = FreelancerMilestoneClient::new(&env, &contract_id)
        .get_project(&project_id);
    assert_eq!(project.status, ProjectStatus::Cancelled);
}

#[test]
fn test_get_client_projects() {
    let env = Env::default();
    env.mock_all_auths();
    let (contract_id, client_addr, _) = deploy_contract(&env);

    let milestones = vec![
        &env,
        create_milestone_input(&env, "Phase 1", "First phase", 1_000_0000),
    ];

    let pid1 = FreelancerMilestoneClient::new(&env, &contract_id)
        .create_project(&client_addr, &String::from_str(&env, "P1"), &String::from_str(&env, "D1"), &milestones);
    let pid2 = FreelancerMilestoneClient::new(&env, &contract_id)
        .create_project(&client_addr, &String::from_str(&env, "P2"), &String::from_str(&env, "D2"), &milestones);

    let projects = FreelancerMilestoneClient::new(&env, &contract_id)
        .get_client_projects(&client_addr);

    assert_eq!(projects.len(), 2);
    assert_eq!(projects.get(0).unwrap(), pid1);
    assert_eq!(projects.get(1).unwrap(), pid2);
}

#[test]
fn test_full_flow() {
    let env = Env::default();
    env.mock_all_auths();
    let (contract_id, client_addr, freelancer) = deploy_contract(&env);

    let milestones = vec![
        &env,
        create_milestone_input(&env, "Milestone 1", "First milestone", 5_000_0000),
    ];

    let pid = FreelancerMilestoneClient::new(&env, &contract_id)
        .create_project(&client_addr, &String::from_str(&env, "Full"), &String::from_str(&env, "Test"), &milestones);

    FreelancerMilestoneClient::new(&env, &contract_id)
        .accept_project(&pid, &freelancer);

    let ms_id = pid * 1000 + 1;
    FreelancerMilestoneClient::new(&env, &contract_id)
        .deposit_milestone(&client_addr, &pid, &ms_id);

    let hash = soroban_sdk::BytesN::from_array(&env, &[0u8; 32]);
    FreelancerMilestoneClient::new(&env, &contract_id)
        .submit_milestone(&pid, &ms_id, &hash);

    FreelancerMilestoneClient::new(&env, &contract_id)
        .approve_milestone(&pid, &ms_id);

    FreelancerMilestoneClient::new(&env, &contract_id)
        .release_payment(&pid, &ms_id);

    let ms = FreelancerMilestoneClient::new(&env, &contract_id)
        .get_milestone(&pid, &ms_id);
    assert_eq!(ms.status, MilestoneStatus::Paid);
}

#[test]
fn test_project_count() {
    let env = Env::default();
    env.mock_all_auths();
    let (contract_id, client_addr, _) = deploy_contract(&env);

    let count = FreelancerMilestoneClient::new(&env, &contract_id)
        .get_project_count();
    assert_eq!(count, 0);

    let milestones = vec![
        &env,
        create_milestone_input(&env, "M1", "Desc", 1_000_0000),
    ];

    FreelancerMilestoneClient::new(&env, &contract_id)
        .create_project(&client_addr, &String::from_str(&env, "P"), &String::from_str(&env, "D"), &milestones);

    let count = FreelancerMilestoneClient::new(&env, &contract_id)
        .get_project_count();
    assert_eq!(count, 1);
}
