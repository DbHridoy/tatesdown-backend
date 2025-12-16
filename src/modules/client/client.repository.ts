import { Types } from "mongoose";
import Client from "./client.model";
import Call from "./call-log.model";
import clientNote from "./client-note.model";
import { buildDynamicSearch } from "../../utils/dynamic-search-utils";

export class ClientRepository {
  searchClientByPhoneNumber = async (phoneNumber: string) => {
    return await Client.findOne({ phoneNumber });
  };

  createClient = async (clientInfo: object) => {
    const newClient = new Client(clientInfo);
    return await newClient.save();
  };

  getAllClients = async (query: any) => {
    const { filter, search, options } = buildDynamicSearch(Client, query);
    return await Client.find({ ...filter, ...search }, null, options)
  };

  getClientById = async (id: string) => {
    return await Client.findById(id).populate("callLogs").populate("notes");
  };

  createCallLog = async (callLogData: object) => {
    const newCallLog = new Call(callLogData);
    return await newCallLog.save();
  };

  getAllCallLogs = async () => {
    return await Call.find();
  };

  getCallLogByClientId = async (clientId: string) => {
    return await Call.find({ clientId });
  };

  createClientNote = async (clientNoteData: object) => {
    const newClientNote = new clientNote(clientNoteData);
    return await newClientNote.save();
  };

  getAllClientNote = async () => {
    return await clientNote.find();
  };

  getClientNoteByClientId = async (clientId: string) => {
    return await clientNote.findById(clientId);
  };
}
