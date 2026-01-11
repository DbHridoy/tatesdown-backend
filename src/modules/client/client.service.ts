import { Types } from "mongoose";
import { ClientRepository } from "./client.repository";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";
import { createNotification } from "../../utils/create-notification-utils";

export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  createClient = async (clientInfo: any) => {
    const existingClient =
      await this.clientRepository.searchClientByPhoneNumber(
        clientInfo.phoneNumber
      );

    if (existingClient) {
      throw new apiError(
        Errors.AlreadyExists.code,
        Errors.AlreadyExists.message
      );
    }
    const newClient = await this.clientRepository.createClient(clientInfo);
    const newNotification = {
      type: "client",
      message: "New client added",
      forUserRole: "admin",
    };
    createNotification(newNotification);

    return newClient;
  };

  createClientNote = async (clientNoteData: any) => {
    const newClientNote = await this.clientRepository.createClientNote(
      clientNoteData
    );

    return newClientNote;
  };

  createCallLog = async (callLogData: any) => {
    const newCallLog = await this.clientRepository.createCallLog(callLogData);
    return newCallLog;
  };

  getAllClients = async (query: any) => {
    return await this.clientRepository.getAllClients(query);
  };

  getClientById = async (id: string) => {
    return await this.clientRepository.getClientById(id);
  };

  getAllCallLogs = async () => {
    return await this.clientRepository.getAllCallLogs();
  };

  getCallLogByClientId = async (id: string) => {
    return await this.clientRepository.getCallLogByClientId(id);
  };

  getAllClientNote = async () => {
    return await this.clientRepository.getAllClientNote();
  };

  getClientNoteByClientId = async (clientId: string) => {
    return await this.clientRepository.getClientNoteByClientId(clientId);
  };

  updateClient = async (clientId: string, clientInfo: any) => {
    return await this.clientRepository.updateClient(clientId, clientInfo);
  };

  deleteClient = async (clientId: string) => {
    return await this.clientRepository.deleteClient(clientId);
  };
}
