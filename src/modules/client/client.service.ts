import { Types } from "mongoose";
import { ClientRepository } from "./client.repository";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";
import { createClientInterface } from "./client.interface";

export class ClientService {
  constructor(private clientRepository: ClientRepository) {}
  createClient = async (clientInfo: createClientInterface) => {
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
    const newClient = this.clientRepository.createClient(clientInfo);

    return newClient;
  };

  getAllClients = async (query:any) => {
    return await this.clientRepository.getAllClients(query);
  };

  getClientById = async (id: string) => {
    return await this.clientRepository.getClientById(id);
  };
  createCallLog = async (callLogData: object) => {
    const newCallLog =await this.clientRepository.createCallLog(callLogData);
    return newCallLog
  };
  getAllCallLogs = async () => {
    return await this.clientRepository.getAllCallLogs();
  };

  getCallLogByClientId = async (id: string) => {
    return await this.clientRepository.getCallLogByClientId(id);
  };

  createClientNote = async (clientNoteData: object) => {
    const newClientNote =
      await this.clientRepository.createClientNote(clientNoteData);

      return newClientNote
  };
  getAllClientNote = async () => {
    return await this.clientRepository.getAllClientNote();
  };
  getClientNoteByClientId = async (clientId: string) => {
    return await this.clientRepository.getClientNoteByClientId(clientId);
  };
  updateClient = async (clientId: string, clientInfo: object) => {
    return await this.clientRepository.updateClient(clientId, clientInfo);
  };
  deleteClient = async (clientId: string) => {
    return await this.clientRepository.deleteClient(clientId);
  };
}
