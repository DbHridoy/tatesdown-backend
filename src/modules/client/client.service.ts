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
  ) {}

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

      salesRepId = salesRep._id;
    }

    const clientPayload = {
      ...body,
      salesRepId,
      createdBy: user.userId,
    };

    const newClient = await this.clientRepo.createClient(clientPayload);

    // Side-effect handled in service
    if (salesRepId) {
      await this.salesRepRepo.incrementTotalClients(salesRepId);
    }

    await this.commonService.incrementOverview({
      totalClients: 1,
    });

    return newClient;
  };

  createCallLog = async (callLogData: any, clientId: string, user: any) => {
    const callLogPayload: any = {
      ...callLogData,
      clientId,
      addedBy: user.userId,
    };
    const newCallLog = await this.clientRepo.createCallLog(callLogPayload);
    return newCallLog;
  };

  createClientNote = async (clientNoteData: any, clientId: string, user: any) => {
    const clientNotePayload: any = {
      ...clientNoteData,
      clientId,
      addedBy: user.userId,
    };
    const newClientNote = await this.clientRepo.createClientNote(
      clientNotePayload
    );

    return newClientNote;
  };

  getAllClients = async (query: any) => {
    return await this.clientRepo.getAllClients(query);
  };

  getClientById = async (id: string) => {
    return await this.clientRepo.getClientById(id);
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
