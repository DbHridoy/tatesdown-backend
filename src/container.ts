import { HashUtils } from "./utils/hash-utils";
import { JwtUtils } from "./utils/jwt-utils";
import { Mailer } from "./utils/mailer-utils";

export const container = {
  hasUtils: new HashUtils(),
  jwtUtils: new JwtUtils(),
  mailerUtils: new Mailer(),
};
