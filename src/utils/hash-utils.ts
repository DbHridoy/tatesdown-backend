import bcrypt from "bcrypt";
import { env } from "../config/env";

export default class HashUtils {
  private saltRounds= env.SALT_ROUNDS
  hashPassword(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }
}
