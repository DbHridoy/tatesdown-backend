import { Router } from "express";
import { ClientRepository } from "./client.repository";
import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  CreateCallLogSchema,
  CreateClientNoteSchema,
  CreateClientSchema,
} from "./client.schema";

const clientRoute = Router();

const clientRepo = new ClientRepository();
const clientService = new ClientService(clientRepo);
const clientController = new ClientController(clientService);

clientRoute.post(
  "/create-client",
  validate(CreateClientSchema),
  clientController.createClient
);

clientRoute.post(
  "/create-call-log",
  validate(CreateCallLogSchema),
  clientController.createCallLog
);

clientRoute.post(
  "/create-client-note",
  validate(CreateClientNoteSchema),
  clientController.createClientNote
);

clientRoute.get("/get-all-clients", clientController.getAllClients);
clientRoute.get("/get-all-calllogs", clientController.getAllCallLogs);
clientRoute.patch("/update-client/:clientId", clientController.updateClient);
clientRoute.get(
  "/get-single-client/:clientId",
  clientController.getSingleClient
);
clientRoute.get(
  "/get-single-calllogs/:clientId",
  clientController.getCallLogsByClientId
);
clientRoute.delete("/delete-client/:clientId", clientController.deleteClient);

export default clientRoute;
