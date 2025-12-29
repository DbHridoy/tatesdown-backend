import { StatsRepository } from "./stats.repository";

export class StatsService {
    constructor(private statsRepo:StatsRepository) {}
    getAdminStats=async()=>{
        const stats=await this.statsRepo.getAdminStats()
        return stats
    }
    getSalesRepStats=async(id:string)=>{
        const stats=await this.statsRepo.getSalesRepStats(id)
        return stats
    }
}