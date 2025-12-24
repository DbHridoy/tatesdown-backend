import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { ClientService } from "./client.service";
import { HttpCodes } from "../../constants/status-codes";

export class ClientController {
  constructor(private clientService: ClientService) {}
  createClient = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;
      const salesRepId=req.user?.userId
      const newClient = await this.clientService.createClient({...body,salesRepId});
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Client created successfully",
        data: newClient,
      });
    }
  );

addNote = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { clientId } = req.params;
  const { note, createdBy } = req.body;

  if (!note || !createdBy) {
    return res.status(400).json({
      success: false,
      message: "Both 'note' and 'createdBy' are required",
    });
  }

  // Add uploaded file URL if present
  const noteData: any = { note, createdBy };
  if (req.file?.fileUrl) {
    noteData.file = req.file.fileUrl; // store file URL in note
  }

  const newNote = await this.clientService.createClientNote(clientId, noteData);

  res.status(HttpCodes.Ok).json({
    success: true,
    message: "Note added successfully",
    data: newNote,
  });
});



  addCallLog = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const {clientId}=req.params
      const { body } = req;
      const newCallLog = await this.clientService.createCallLog(clientId,body);
      res.status(HttpCodes.Ok).json({
        success: true,
        message: "Call log created successfully",
        data: newCallLog,
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
