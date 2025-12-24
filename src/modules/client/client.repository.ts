import { Types } from "mongoose";
import { Client, Note } from "./client.model";
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
    return await Client.find({ ...filter, ...search }, null, options);
  };

  getClientById = async (id: string) => {
    return await Client.findById(id).populate("callLogs").populate("notes");
  };

  createCallLog = async (clientId: string, callLogData: object) => {
    const addedCallLog = await Client.findByIdAndUpdate(clientId, {
      $push: { callLogs: callLogData },
    });
    return addedCallLog;
  };

createClientNote = async (clientId: string, clientNoteData: Partial<Note>) => {
  const updatedClient = await Client.findByIdAndUpdate(
    clientId,
    { $push: { notes: clientNoteData } },
    { new: true, runValidators: true }
  );

  if (!updatedClient) {
    throw new Error("Client not found");
  }

  // Return only the newly added note
  return updatedClient.notes[updatedClient.notes.length - 1];
};





updateClient = async (clientId: string, clientInfo: any) => {
  const updateQuery: any = {};
  // Extract notes/callLogs and remove _id if present
  const { notes, callLogs, _id, ...rest } = clientInfo;

  // Top-level fields
  if (Object.keys(rest).length) {
    updateQuery.$set = rest;
  }

  // Append new notes
  if (notes?.length) {
    updateQuery.$push = { notes: { $each: notes } };
  }

  // Append new callLogs
  if (callLogs?.length) {
    updateQuery.$push = { ...updateQuery.$push, callLogs: { $each: callLogs } };
  }

  if (!Object.keys(updateQuery).length) {
    throw new Error("No valid fields provided for update");
  }

  const updatedClient = await Client.findByIdAndUpdate(clientId, updateQuery, {
    new: true,
    runValidators: true,
  });

  if (!updatedClient) throw new Error("Client not found");

  return updatedClient;
};

  deleteClient = async (clientId: string) => {
    return await Client.findByIdAndDelete(clientId);
  };
}
