import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { CallLogSchema, ClientSchema } from "./client.schema";
import { authMiddleware, clientController } from "../../container";
import { uploadFile } from "../../middlewares/uploadLocal.middleware";

const clientRoute = Router();

clientRoute.use(authMiddleware.authenticate);

//---------------------post------------------------//

clientRoute.post(
  "/",
  // validate(ClientSchema),
  clientController.createClient
);
clientRoute.post(
  "/:clientId/call-log",
  validate(CallLogSchema),
  clientController.createCallLog
);
clientRoute.post(
  "/:clientId/client-note",
  uploadFile({
    fieldName: "file",
    uploadType: "single",
  }),
  // validate(CreateClientNoteSchema),
  clientController.createClientNote
);

//---------------------get------------------------//

clientRoute.get("/", clientController.getAllClients);
clientRoute.get("/:clientId", clientController.getSingleClient);
clientRoute.get("/call-log", clientController.getAllCallLogs);
clientRoute.get("/:clientId/call-log", clientController.getCallLogsByClientId);

//---------------------patch------------------------//

clientRoute.patch("/:clientId", clientController.updateClient);

//---------------------delete------------------------//

clientRoute.delete("/:clientId", clientController.deleteClient);

export default clientRoute;
