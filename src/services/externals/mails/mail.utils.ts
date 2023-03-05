import nodemailer from "nodemailer";
import configs from "../../../config/env.config";

const { ORGANIZATION_EMAIL, EMAIL_PASSWORD } = configs;

const transporterEmail = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: `${ORGANIZATION_EMAIL}`,
    pass: `${EMAIL_PASSWORD}`,
  },
});

type EMAIL_CONFIG = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};
export const sendEmail = async (
  config: EMAIL_CONFIG,
  callback: (info: unknown) => void
): Promise<void> => {
  try {
    const info = await transporterEmail.sendMail({
      from: ORGANIZATION_EMAIL,
      ...config,
    });
    callback(info);
  } catch (error) {
    console.log(error);
  }
};
