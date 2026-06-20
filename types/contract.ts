export * from "./index";

export interface ContractClientConfig {
  contractId: string;
  networkPassphrase: string;
  rpcUrl: string;
  allowHttp?: boolean;
}

export interface ContractMethodResult {
  result: any;
  transactionHash: string;
}
