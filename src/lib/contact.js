import { profile } from "../data/profile.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns an object of field -> message. Empty object means the values are valid. */
export const validateContact = ({ name, email, message }) => {
  const errors = {};
  if (name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Please enter a valid email address.";
  if (message.trim().length < 10) errors.message = "Please write at least 10 characters.";
  return errors;
};

export const buildMailto = ({ name, email, message }) => {
  const subject = `Portfolio message from ${name}`;
  const body = `${message}\n\n-- ${name} (${email})`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const defaultNavigate = (url) => {
  window.location.href = url;
};

/**
 * Send a contact message.
 * - If VITE_CONTACT_ENDPOINT is set (M5 backend), POST the message there as JSON.
 * - Otherwise fall back to opening the visitor's email app with the message pre-filled.
 * Resolves to { mode: "api" | "mailto" }; rejects if the API request fails.
 */
export async function sendContact(values, { navigate = defaultNavigate } = {}) {
  const payload = {
    name: values.name.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
  };

  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;
  if (endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Contact request failed (${response.status})`);
    return { mode: "api" };
  }

  navigate(buildMailto(payload));
  return { mode: "mailto" };
}
