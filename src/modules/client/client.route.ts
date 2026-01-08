import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import {
  CreateCallLogSchema,
  CreateClientNoteSchema,
  CreateClientSchema,
} from "./client.schema";
import { clientController } from "../../container";
import { uploadFile } from "../../middlewares/uploadLocal.middleware";

const clientRoute = Router();

//---------------------post------------------------//

clientRoute.post(
  "/",
  validate(CreateClientSchema),
  clientController.createClient
);
clientRoute.post(
  "/:clientId/call-log",
  validate(CreateCallLogSchema),
  clientController.createCallLog
);
clientRoute.post(
  "/:clientId/client-note",
  uploadFile({
    fieldName: "file",
    uploadType: "single",
  }),
  validate(CreateClientNoteSchema),
  clientController.createClientNote
);

//---------------------get------------------------//

clientRoute.get("/", clientController.getAllClients);
clientRoute.get(
  "/:clientId",
  clientController.getSingleClient
);
clientRoute.get("/call-log", clientController.getAllCallLogs);
clientRoute.get(
  "/:clientId/call-log",
  clientController.getCallLogsByClientId
);

//---------------------patch------------------------//

clientRoute.patch("/:clientId", clientController.updateClient);

//---------------------delete------------------------//

clientRoute.delete("/:clientId", clientController.deleteClient);

export default clientRoute;
