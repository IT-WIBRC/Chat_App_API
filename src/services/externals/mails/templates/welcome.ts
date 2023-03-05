import { MODEL_HTML_TEMPLATE } from "./structure";

export const HTML_TEMPLATE = (
  title: string,
  name: string,
  address: string
): string => {
  return MODEL_HTML_TEMPLATE(
    title,
    `<p>Your account has been created successfully. Please start to enjoy and if any difficulty, report please to this mail address <a href='mailto:${address}'>${address}</a>.</p>`,
    name
  );
};
