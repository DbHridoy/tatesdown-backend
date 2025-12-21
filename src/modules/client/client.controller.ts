import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { ClientService } from "./client.service";
import { HttpCodes } from "../../constants/status-codes";

export class ClientController {
  constructor(private clientService: ClientService) {}
  createClient = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;
      const newClient = await this.clientService.createClient(body);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Client created successfully",
        data: newClient,
      });
    }
  );

  createCallLog = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;
      const newCallLog = await this.clientService.createCallLog(body);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Call log created successfully",
        data: newCallLog,
      });
    }
  );

  createClientNote = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;
      const newNote =await this.clientService.createClientNote(body);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Client note created successfully",
        data: newNote,
      });
    }
  );

  getAllClients = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;
      const allClients = await this.clientService.getAllClients(query);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "All clients fetched successfully",
        data: allClients,
      });
    }
  );

  getSingleClient = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const clientId = req.params.clientId;
      const client = await this.clientService.getClientById(clientId);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Client fetched successfully",
        data: client,
      })
    }
  );

  getAllCallLogs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const allCallLogs = this.clientService.getAllCallLogs();
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "All call logs fetched successfully",
        data: allCallLogs,
      });
    }
  );

  getCallLogsByClientId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const clientId = req.params.clientId;
      const callLogs = this.clientService.getCallLogByClientId(clientId);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "All call logs for this client fetched successfully",
        data: callLogs,
      });
    }
  );

  getAllClientNotes = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const allClientNotes = this.clientService.getAllClientNote();
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "All client notes fetched successfully",
        data: allClientNotes,
      });
    }
  );

  getClientNotesByClientId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const clientId = req.params.clientId;
      const clientNotes = this.clientService.getClientNoteByClientId;
    }
  );
  updateClient=asyncHandler(
    async(req:Request,res:Response,next:NextFunction)=>{
      const clientId=req.params.clientId
      const updatedClientInfo=req.body
      const updatedClient=await this.clientService.updateClient(clientId,updatedClientInfo)
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Client updated successfully",
        data: updatedClient,
      })
    }
  )
  deleteClient=asyncHandler(
    async (req:Request,res:Response,next:NextFunction)=>{
      const clientId = req.params.clientId;
      const deletedClient =await this.clientService.deleteClient(clientId);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Client deleted successfully",
        data: deletedClient,
      })
    }
  )
}
