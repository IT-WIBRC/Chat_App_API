import { MODEL_HTML_TEMPLATE } from "./structure";

export const HTML_TEMPLATE_RESET_PASSWORD = (
  title: string,
  userId: string,
  resetToken: string,
  origin: string,
  api: string
): string => {
  const resetUrl = `${origin}/${api}/resetPassword?token=${resetToken}&id=${userId}`;
  const message = `<p>Please click the below link to reset your password, the following link will be valid for only 1 hour:</p>
  <p><a href="${resetUrl}">${resetUrl}</a></p>`;

  return MODEL_HTML_TEMPLATE(title, message);
};
