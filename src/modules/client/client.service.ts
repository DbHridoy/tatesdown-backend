import { Types } from "mongoose";
import { ClientRepository } from "./client.repository";
import { apiError } from "../../errors/api-error";
import { Errors } from "../../constants/error-codes";
import { createClientInterface } from "./client.interface";
import { Note } from "./client.model";

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

  getAllClients = async (query: any) => {
    return await this.clientRepository.getAllClients(query);
  };

  getClientById = async (id: string) => {
    return await this.clientRepository.getClientById(id);
  };

  createCallLog = async (clientId: string, callLogData: object) => {
    const newCallLog = await this.clientRepository.createCallLog(
      clientId,
      callLogData
    );
    return newCallLog;
  };

createClientNote = async (clientId: string, clientNoteData: Partial<Note>) => {
  const newClientNote = await this.clientRepository.createClientNote(
    clientId,
    clientNoteData
  );
  return newClientNote;
};


  updateClient = async (clientId: string, clientInfo: object) => {
    return await this.clientRepository.updateClient(clientId, clientInfo);
  };

  deleteClient = async (clientId: string) => {
    return await this.clientRepository.deleteClient(clientId);
  };
}
