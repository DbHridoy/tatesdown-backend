import jwt from "jsonwebtoken";
import { env } from "../config/env";

export class JwtUtils {
    private accessSecret = env.JWT_ACCESS_SECRET;
    private refreshSecret = env.JWT_REFRESH_SECRET;
    private accessExpiry = env.JWT_ACCESS_EXPIRY;
    private refreshExpiry = env.JWT_REFRESH_EXPIRY;

    generateAccessToken(payload: object): string {
        return jwt.sign(payload, this.accessSecret, {
            expiresIn: this.accessExpiry
        });
    }

    generateRefreshToken(payload: object): string {
        return jwt.sign(payload, this.refreshSecret, {
            expiresIn: this.refreshExpiry
        });
    }
}
