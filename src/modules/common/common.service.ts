import { CommonRepository } from "./common.repository";

export class CommonService {
  constructor(private readonly commonRepository: CommonRepository) {}

  generateSequentialId = async (prefix: string, counterName: string) => {
    const id = await this.commonRepository.generateSequentialId(
      prefix,
      counterName
    );
    return id;
  };

  createCluster = async (clusterName: string) => {
    const cluster = await this.commonRepository.createCluster(clusterName);
    return cluster;
  };

  getVariable = async () => {
    const variable = await this.commonRepository.getVariable();
    return variable;
  };

  upsertVariable = async (variables: any) => {
    return this.commonRepository.upsertVariable(variables);
  };

  getCluster = async () => {
    const clusters = await this.commonRepository.getCluster();
    return clusters;
  };

  getNotification=async(query:any)=>{
    const notifications=await this.commonRepository.getNotification(query)
    return notifications
  }
  
}
