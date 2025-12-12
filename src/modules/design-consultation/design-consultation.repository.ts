import DesignConsultation from "./design-consultation.model";

export class DesignConsultationRepository {
    createNewDesignConsultation = async (designConsultationInfo: object) => {
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