import { NextFunction,Request,Response } from "express";
import { DesignConsultationService } from "./design-consultation.service";
import { asyncHandler } from "../../utils/async-handler";
import { TypedRequestBody } from "../../types/request.type";
import { createDesignConsultationSchemaType } from "./design-consultation.type";
import { HttpCodes } from "../../constants/status-codes";

export class DesignConsultationController {
    constructor(private readonly designConsultationService: DesignConsultationService) {}

    createNewDesignConsultation=asyncHandler(async (req:TypedRequestBody<createDesignConsultationSchemaType>,res:Response,next:NextFunction)=>{
        const consultationBody=req.body
        const newDesignConsultation=await this.designConsultationService.createNewDesignConsultation(consultationBody)
        res.status(HttpCodes.Ok).json({
            success:true,
            message:"Design Consultation created successfully",
            data:newDesignConsultation
        })
    })

    getAllDesignConsultation=asyncHandler(async (req:Request,res:Response,next:NextFunction)=>{
        const allDesignConsultation=await this.designConsultationService.getAllDesignConsultation()
        res.status(HttpCodes.Ok).json({
            success:true,
            message:"All Design Consultation fetched successfully",
            data:allDesignConsultation
        })
    })

    getDesignConsultationById=asyncHandler(async (req:Request,res:Response,next:NextFunction)=>{
        const {id}=req.params
        const designConsultation=await this.designConsultationService.getDesignConsultationById(id)
        res.status(HttpCodes.Ok).json({
            success:true,
            message:"Design Consultation fetched successfully",
            data:designConsultation
        })
    })
}