import { Types } from "mongoose";
import { ClientRepository } from "./client.repository";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";
import { createNotification } from "../../utils/create-notification-utils";
import { SalesRepRepository } from "../sales-rep/sales-rep.repository";
import { CommonService } from "../common/common.service";

export class ClientService {
  constructor(
    private clientRepo: ClientRepository,
    private salesRepRepo: SalesRepRepository,
    private commonService: CommonService
  ) { }

  createClient = async ({ body, user }: { body: any; user: any }) => {
    let salesRepId: Types.ObjectId | null = null;

    // Role-based rule
    if (user.role !== "Sales Rep") {
      salesRepId = null;
    } else {
      const salesRep = await this.salesRepRepo.findByUserId(user.userId);

      if (!salesRep) {
        throw new Error("Sales rep profile not found");
      }

      salesRepId = user.userId;
    }


    const clientPayload = {
      ...body,
      salesRepId,
      createdBy: user.userId,
    };

    const newClient = await this.clientRepo.createClient(clientPayload);

    const clientNote = {
      clientId: newClient._id,
      note: body.note,
      createdBy: user.userId,
    }
    if (newClient.salesRepId) {
      await this.salesRepRepo.incrementSalesRepStats('client', newClient.salesRepId);
    }
    await this.clientRepo.createClientNote(clientNote);

    return newClient;
  };

  createCallLog = async (callLogData: any, clientId: string, user: any) => {
    const callLogPayload: any = {
      ...callLogData,
      clientId,
      createdBy: user.userId,
    };
    const newCallLog = await this.clientRepo.createCallLog(callLogPayload);
    return newCallLog;
  };

  createClientNote = async (clientNoteData: any, clientId: string, user: any) => {
    const clientNotePayload: any = {
      ...clientNoteData,
      quoteId: clientNoteData.quoteId || null,
      jobId: clientNoteData.jobId || null,
      clientId,
      createdBy: user.userId,
    };
    const newClientNote = await this.clientRepo.createClientNote(
      clientNotePayload
    );

    return newClientNote;
  };

  getAllClients = async (query: any) => {
    return await this.clientRepo.getAllClients(query);
  };

  getClientById = async (clientId: string) => {
    return await this.clientRepo.getClientById(clientId);
  };

  getAllCallLogs = async () => {
    return await this.clientRepo.getAllCallLogs();
  };

  getCallLogByClientId = async (id: string) => {
    return await this.clientRepo.getCallLogByClientId(id);
  };

  getAllClientNote = async () => {
    return await this.clientRepo.getAllClientNote();
  };

  getClientNoteByClientId = async (clientId: string) => {
    return await this.clientRepo.getClientNoteByClientId(clientId);
  };

  updateClient = async (clientId: string, clientInfo: any) => {
    return await this.clientRepo.updateClient(clientId, clientInfo);
  };

  deleteClient = async (clientId: string) => {
    return await this.clientRepo.deleteClient(clientId);
  };
}
