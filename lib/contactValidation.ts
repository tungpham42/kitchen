export const CONTACT_TOPICS = [
  "Website feedback",
  "Account support",
  "Share / report a recipe error",
  "Partnerships & advertising",
  "Other",
] as const;

export const MIN_MESSAGE = 10;
export const MAX_MESSAGE = 2000;

export type ContactErrors = {
  name?: string;
  email?: string;
  message?: string;
  form?: string;
};

export function validateName(value: string) {
  const v = value.trim();
  if (!v) return "You have not entered your name.";
  if (v.length < 2) return `Name is too short (${v.length}/2 minimum characters).`;
  if (v.length > 80) return "Name can be at most 80 characters.";
  return "";
}

export function validateEmail(value: string) {
  const v = value.trim();
  if (!v) return "You have not entered an email address.";
  if (/\s/.test(v)) return "Email must not contain spaces.";
  if (!v.includes("@"))
    return "Email is missing the “@” character. Correct example: you@example.com";
  if (v.split("@").length > 2) return "Email must contain only one “@” character.";
  const [local, domain = ""] = v.split("@");
  if (!local) return "Email is missing the name before “@”. Example: you@example.com";
  if (!domain) return "Email is missing the domain after “@”. Example: you@example.com";
  if (!domain.includes("."))
    return "The email domain is missing an extension, such as “.com” or “.vn”.";
  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes(".."))
    return "The email domain is invalid (misplaced period).";
  if (v.length > 120) return "Email can be at most 120 characters.";
  return "";
}

export function validateMessage(value: string) {
  const len = value.trim().length;
  if (!len) return "You have not entered a message.";
  if (len < MIN_MESSAGE)
    return `The message is ${MIN_MESSAGE - len} characters short (minimum ${MIN_MESSAGE} characters, currently ${len}).`;
  if (len > MAX_MESSAGE) return `The message can be at most ${MAX_MESSAGE} characters.`;
  return "";
}
