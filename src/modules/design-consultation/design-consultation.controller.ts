import { NextFunction } from "express";
import { DesignConsultationService } from "./design-consultation.service";
import { asyncHandler } from "../../utils/async-handler";

export class DesignConsultationController {
    constructor(private readonly designConsultationService: DesignConsultationService) {}

    createNewDesignConsultation=asyncHandler(async (req:Response,res:Response,next:NextFunction)=>{
        const consultationBody=req.body
        const newDesignConsultation=await this.designConsultationService.createNewDesignConsultation(consultationBody)
        res.status(201).json({
            success:true,
            data:newDesignConsultation
        })
    })
    
}