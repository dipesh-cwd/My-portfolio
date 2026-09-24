import { Github, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { profile } from "../data/profile.js";
import { useTranslation } from "../i18n/index.js";
import { sendContact, validateContact } from "../lib/contact.js";
import { WindowPage } from "./ui.jsx";

const EMPTY = { name: "", email: "", message: "" };

const inputClass =
  "w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--content-text)] outline-none placeholder:text-[var(--muted-text)] focus:border-blue-400";

const Field = ({ label, name, error, children }) => (
  <div>
    <label htmlFor={`contact-${name}`} className="mb-1 block text-sm text-[var(--content-text)]">
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

const Contact = () => {
  const t = useTranslation();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle" });

  const links = [
    {
      label: t("contact.linkEmail"),
      href: `mailto:${profile.email}`,
      text: profile.email,
      Icon: Mail,
    },
    {
      label: t("contact.linkGithub"),
      href: profile.github,
      text: t("contact.linkGithub"),
      Icon: Github,
    },
    {
      label: t("contact.linkLinkedin"),
      href: profile.linkedin,
      text: t("contact.linkLinkedin"),
      Icon: Linkedin,
    },
  ].filter((link) => link.href);

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
    <WindowPage title={t("apps.contact")} subtitle={t("contact.subtitle")}>
      <ul className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {links.map(({ label, href, text, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-[var(--accent-text)] hover:underline"
            >
              <Icon size={15} aria-hidden="true" />
              {text}
            </a>
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label={t("contact.name")} name="name" error={errors.name && t(errors.name)}>
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

        <Field label={t("contact.email")} name="email" error={errors.email && t(errors.email)}>
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

        <Field
          label={t("contact.message")}
          name="message"
          error={errors.message && t(errors.message)}
        >
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
            {sending ? t("contact.sending") : t("contact.send")}
          </button>

          <p role="status" className="text-sm">
            {status.state === "sent" && status.mode === "api" && (
              <span className="text-green-400">{t("contact.sentApi")}</span>
            )}
            {status.state === "sent" && status.mode === "mailto" && (
              <span className="text-green-400">{t("contact.sentMailto")}</span>
            )}
            {status.state === "error" && <span className="text-red-400">{t("contact.error")}</span>}
          </p>
        </div>
      </form>
    </WindowPage>
  );
};

export default Contact;
