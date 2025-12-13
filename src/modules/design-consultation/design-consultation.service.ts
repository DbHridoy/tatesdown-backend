import { DesignConsultationRepository } from "./design-consultation.repository";
import { createDesignConsultationSchemaType } from "./design-consultation.type";

export class DesignConsultationService {
    constructor(private readonly designConsultationRepository: DesignConsultationRepository) {}

    createNewDesignConsultation=async(designConsultationInfo:createDesignConsultationSchemaType)=>{
        return await this.designConsultationRepository.createNewDesignConsultation(designConsultationInfo)
    }
    getAllDesignConsultation=async ()=>{
        return await this.designConsultationRepository.getAllDesignConsultation()
    }
    getDesignConsultationById=async(id:string)=>{
        return await this.designConsultationRepository.getDesignConsultationById(id)
    }
}