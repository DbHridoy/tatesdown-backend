import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import {
  CreateCallLogSchema,
  CreateClientNoteSchema,
  CreateClientSchema,
} from "./client.schema";
import { authMiddleware, clientController } from "../../container";
import { uploadFile } from "../../middlewares/uploadLocal.middleware";

const clientRoute = Router();

clientRoute.use(authMiddleware.authenticate)

clientRoute.post(
  "/create-client",
  clientController.createClient
);

clientRoute.post(
  "/add-note/:clientId",
  uploadFile({ fieldName: "file", uploadType: "single" }),
  clientController.addNote
);
clientRoute.post(
  "/add-call-log/:clientId",
  clientController.addCallLog
);
clientRoute.get("/get-all-clients", clientController.getAllClients);

clientRoute.get(
  "/get-single-client/:clientId",
  clientController.getSingleClient
);
clientRoute.patch("/update-client/:clientId", clientController.updateClient);
clientRoute.delete("/delete-client/:clientId", clientController.deleteClient);

export default clientRoute;
