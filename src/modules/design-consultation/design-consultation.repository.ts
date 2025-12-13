import DesignConsultation from "./design-consultation.model";
import { createDesignConsultationSchemaType } from "./design-consultation.type";

export class DesignConsultationRepository {
    createNewDesignConsultation = async (designConsultationInfo: createDesignConsultationSchemaType) => {
        const newDesignConsultation = new DesignConsultation(designConsultationInfo);
        return await newDesignConsultation.save();
    };

    getAllDesignConsultation = async () => {
        return await DesignConsultation.find();
    };

    getDesignConsultationById = async (id: string) => {
        return await DesignConsultation.findById(id);
    };
}