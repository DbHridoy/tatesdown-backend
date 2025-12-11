import { env } from "../config/env";
import { transporter } from "../config/nodemailer";

export class Mailer {
  sendOtp = async (email: string, otp: number) => {
    await transporter.sendMail({
      from: `"Developer" <${env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h3>Password Reset</h3>
        <p>Your OTP code is: <b>${otp}</b></p>
        <p>This code will expire in 5 minutes.</p>
      `,
    });
  };
}
