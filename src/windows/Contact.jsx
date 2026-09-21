import { Github, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { profile } from "../data/profile.js";
import { sendContact, validateContact } from "../lib/contact.js";
import { WindowPage } from "./ui.jsx";

const EMPTY = { name: "", email: "", message: "" };

const inputClass =
  "w-full rounded-md border border-gray-600 bg-[#2a2a2a] px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-400";

const Field = ({ label, name, error, children }) => (
  <div>
    <label htmlFor={`contact-${name}`} className="mb-1 block text-sm text-gray-300">
      {label}
    </label>
    {children}
    {error && (
      <p role="alert" className="mt-1 text-xs text-red-400">
        {error}
      </p>
    )}
  </div>
);

const links = [
  { label: "Email", href: `mailto:${profile.email}`, text: profile.email, Icon: Mail },
  { label: "GitHub", href: profile.github, text: "GitHub", Icon: Github },
  { label: "LinkedIn", href: profile.linkedin, text: "LinkedIn", Icon: Linkedin },
].filter((link) => link.href);

const Contact = () => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle" });

  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status.state === "sending") return;

    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus({ state: "sending" });
    try {
      const { mode } = await sendContact(values);
      setValues(EMPTY);
      setStatus({ state: "sent", mode });
    } catch {
      setStatus({ state: "error" });
    }
  };

  const sending = status.state === "sending";

  return (
    <WindowPage title="Contact" subtitle="Have a project or question? Send me a message.">
      <ul className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {links.map(({ label, href, text, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-blue-300 hover:underline"
            >
              <Icon size={15} aria-hidden="true" />
              {text}
            </a>
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Name" name="name" error={errors.name}>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={onChange}
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
          />
        </Field>

        <Field label="Email" name="email" error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={onChange}
            aria-invalid={Boolean(errors.email)}
            className={inputClass}
          />
        </Field>

        <Field label="Message" name="message" error={errors.message}>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={onChange}
            aria-invalid={Boolean(errors.message)}
            className={`${inputClass} resize-none`}
          />
        </Field>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={sending}
            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send message"}
          </button>

          <p role="status" className="text-sm">
            {status.state === "sent" && status.mode === "api" && (
              <span className="text-green-400">Thanks! Your message was sent.</span>
            )}
            {status.state === "sent" && status.mode === "mailto" && (
              <span className="text-green-400">
                Your email app should open with the message ready to send.
              </span>
            )}
            {status.state === "error" && (
              <span className="text-red-400">Something went wrong. Please try again.</span>
            )}
          </p>
        </div>
      </form>
    </WindowPage>
  );
};

export default Contact;
