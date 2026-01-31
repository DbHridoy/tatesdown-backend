import { Client } from "./client.model";
import Call from "./call-log.model";
import clientNote from "./client-note.model";
import {
  applyDynamicSearchToArray,
  buildDynamicSearch,
} from "../../utils/dynamic-search-utils";
import { logger } from "../../utils/logger";
import { Job } from "../job/job.model";
import { DesignConsultation } from "../job/design-consultation.model";

export class ClientRepository {
  searchClientByPhoneNumber = async (phoneNumber: string) => {
    return await Client.findOne({ phoneNumber });
  };

  createClient = async (clientInfo: any) => {
    const newClient = new Client(clientInfo);
    return await newClient.save();
  };

  createCallLog = async (callLogData: any) => {
    const newCallLog = new Call(callLogData);
    return await newCallLog.save();
  };

  createClientNote = async (clientNoteData: any) => {
    const newClientNote = new clientNote(clientNoteData);
    return await newClientNote.save();
  };

  getAllClients = async (query: any) => {
    const { filter, search, options } = buildDynamicSearch(Client, query);
    // logger.info({ filter, search, options }, "ClientRepository.getAllClients");
    const [clients, total] = await Promise.all([
      Client.find({ ...filter, ...search }, null, options),
      Client.countDocuments({ ...filter, ...search }),
    ]);
    return { data: clients, total };
  };

  getClientById = async (clientId: string) => {
    return await Client.findById(clientId)
      .populate("callLogs")
      .populate("notes");
  };

  getAllCallLogs = async (query: any) => {
    const { filter, search, options } = buildDynamicSearch(Call, query);
    const [callLogs, total] = await Promise.all([
      Call.find({ ...filter, ...search }, null, options),
      Call.countDocuments({ ...filter, ...search }),
    ]);
    return { data: callLogs, total };
  };

  getCallLogByClientId = async (clientId: string, query: any) => {
    const { filter, search, options } = buildDynamicSearch(Call, query);
    const finalFilter = { ...filter, ...search, clientId };
    const [callLogs, total] = await Promise.all([
      Call.find(finalFilter, null, options),
      Call.countDocuments(finalFilter),
    ]);
    return { data: callLogs, total };
  };

  getAllClientNote = async (query: any) => {
    const { filter, search, options } = buildDynamicSearch(clientNote, query);
    const [notes, total] = await Promise.all([
      clientNote.find({ ...filter, ...search }, null, options),
      clientNote.countDocuments({ ...filter, ...search }),
    ]);
    return { data: notes, total };
  };

  getClientNoteByClientId = async (clientId: string) => {
    return await clientNote.findById(clientId);
  };

  getContractsByClientId = async (clientId: string, query: any) => {
    const [jobs, designConsultations] = await Promise.all([
      Job.find(
        { clientId, contractUrl: { $exists: true, $ne: "" } },
        { contractUrl: 1, clientId: 1, _id: 1, createdAt: 1 }
      ),
      DesignConsultation.find(
        { clientId, contractUrl: { $exists: true, $ne: "" } },
        { contractUrl: 1, clientId: 1, _id: 1, jobId: 1, createdAt: 1 }
      ),
    ]);
    return applyDynamicSearchToArray(
      [
        ...jobs.map((job) => ({
          contractUrl: job.contractUrl,
          clientId: job.clientId,
          jobId: job._id,
          designConsultationId: null,
          source: "job",
          createdAt: job.createdAt,
        })),
        ...designConsultations.map((dc) => ({
          contractUrl: dc.contractUrl,
          clientId: dc.clientId,
          jobId: dc.jobId,
          designConsultationId: dc._id,
          source: "designConsultation",
          createdAt: dc.createdAt,
        })),
      ],
      query,
      { stringFields: ["contractUrl", "source"] }
    );
  };

  updateClient = async (clientId: string, clientInfo: any) => {
    return await Client.findByIdAndUpdate(clientId, clientInfo, { new: true });
  };

  updateLeadStatus = async (clientId: string, leadStatus: any) => {
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { leadStatus },
      { new: true }
    );
    return updatedClient;
  };

  deleteClient = async (clientId: string) => {
    return await Client.findByIdAndDelete(clientId);
  };
}
