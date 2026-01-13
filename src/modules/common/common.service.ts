import { CommonRepository } from "./common.repository";
import { SalesRepRepository } from "../sales-rep/sales-rep.repository";
import { getFiscalPeriods } from "../../utils/fiscalPeriods";

export class CommonService {
  constructor(
    private readonly commonRepository: CommonRepository,
    private readonly salesRepRepo: SalesRepRepository
  ) {}

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

  getNotification = async (query: any) => {
    const notifications = await this.commonRepository.getNotification(query);
    return notifications;
  };

  getAdminStats = async () => {
    const stats = await this.commonRepository.getAdminStats();
    return stats;
  };

  getSalesRepStats = async (id: string) => {
    const stats = await this.commonRepository.getSalesRepStats(id);
    return stats;
  };

  getSalesRepLeaderboard = async () => {
    const stats = await this.salesRepRepo.getLeaderboard();
    return stats;
  };

  incrementOverview = async (
    inc: Record<string, number>,
    date = new Date()
  ) => {
    const fiscalYear = await this.commonRepository.getActiveFiscalYear();
    if (!fiscalYear) throw new Error("No active fiscal year");

    if (date < fiscalYear.startDate || date > fiscalYear.endDate) {
      return; // ignore outside FY
    }

    const periods = getFiscalPeriods(date, fiscalYear);

    for (const [type, data] of Object.entries(periods)) {
      await this.commonRepository.incrementOverview({
        fiscalYearId: fiscalYear._id,
        periodType: type,
        periodIndex: data.index,
        periodStart: data.start,
        inc,
      });
    }
  };
}
