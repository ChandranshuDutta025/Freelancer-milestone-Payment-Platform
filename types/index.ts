export type ProjectStatus = "Open" | "InProgress" | "Completed" | "Cancelled";

export type MilestoneStatus =
  | "Pending"
  | "InProgress"
  | "Submitted"
  | "Approved"
  | "Paid";

export type TransactionStatus = "idle" | "pending" | "success" | "failed";

export type EventType =
  | "project_created"
  | "project_accepted"
  | "milestone_funded"
  | "milestone_submitted"
  | "milestone_approved"
  | "payment_released"
  | "project_cancelled";

export interface Project {
  id: number;
  client: string;
  freelancer: string | null;
  title: string;
  description: string;
  totalMilestones: number;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
}

export interface MilestoneInput {
  title: string;
  description: string;
  amount: number;
}

export interface Milestone {
  id: number;
  projectId: number;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  deliveryHash: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface WalletInfo {
  address: string;
  network: string;
  balance: string;
}

export interface ContractEvent {
  id: string;
  type: EventType;
  projectId: number;
  milestoneId?: number;
  walletAddress: string;
  amount?: number;
  title?: string;
  timestamp: number;
  txHash: string;
}

export interface TransactionRecord {
  hash: string;
  status: TransactionStatus;
  type: string;
  projectId?: number;
  milestoneId?: number;
  timestamp: number;
  errorMessage?: string;
}

export interface WalletError {
  code: string;
  message: string;
}
