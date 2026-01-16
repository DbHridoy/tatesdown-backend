import { CommonRepository } from "./common.repository";
import { SalesRepRepository } from "../sales-rep/sales-rep.repository";
import { getFiscalPeriods } from "../../utils/fiscalPeriods";
import { logger } from "../../utils/logger";
import { Types } from "mongoose";
import { ProductionManagerRepository } from "../production-manager/production-manager.repository";

export class CommonService {
  constructor(
    private readonly commonRepository: CommonRepository,
    private readonly salesRepRepo: SalesRepRepository,
    private readonly productionManagerRepo: ProductionManagerRepository
  ) { }

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
  getMyStats = async (user: any) => {
    if (user.role === 'Sales Rep') {
      const salesRep = await this.salesRepRepo.findByUserId(user.userId);
      if (!salesRep) return null;
      const stats = await this.salesRepRepo.getSalesRepProfile(salesRep._id);
      return stats;
    }
    else if (user.role === 'Production Manager') {
      const productionManager = await this.productionManagerRepo.findByUserId(user.userId);
      if (!productionManager) return null;
      const profile = await this.productionManagerRepo.getProductionManagerProfile(productionManager._id);
      return profile;
    }
    return null;
  };

  incrementOverview = async (
    inc: Record<string, number>,
    date = new Date()
  ) => {


    logger.info({ inc, date }, "CommonService.incrementOverview");
    const fiscalYear = await this.commonRepository.getActiveFiscalYear();
    logger.info({ fiscalYear }, "CommonService.incrementOverview");
    if (!fiscalYear) throw new Error("No active fiscal year");

    if (date < fiscalYear.startDate || date > fiscalYear.endDate) {
      return; // ignore outside FY
    }

    const periods = getFiscalPeriods(date, fiscalYear);
    logger.info({ periods }, "CommonService.incrementOverview");
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
