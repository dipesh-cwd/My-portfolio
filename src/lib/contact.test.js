import { afterEach, describe, expect, it, vi } from "vitest";
import { profile } from "../data/profile.js";
import { buildMailto, sendContact, validateContact } from "./contact.js";

const valid = { name: "Sam", email: "sam@example.com", message: "Hello, I like your portfolio!" };

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("validateContact", () => {
  it("accepts good values", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("reports every invalid field", () => {
    const errors = validateContact({ name: " ", email: "nope", message: "short" });
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
  });

  it.each(["a@b", "a b@c.com", "@c.com", "a@.com"])("rejects the email %s", (email) => {
    expect(validateContact({ ...valid, email }).email).toBeDefined();
  });
});

describe("buildMailto", () => {
  it("targets the profile email and URL-encodes subject and body", () => {
    const url = buildMailto({ name: "Sam & Co", email: "s@x.com", message: "Hi there, 100% sure" });
    expect(url.startsWith(`mailto:${profile.email}?subject=`)).toBe(true);
    expect(url).toContain("Sam%20%26%20Co");
    expect(url).toContain("100%25%20sure");
    expect(url).not.toContain(" ");
  });
});

describe("sendContact", () => {
  it("falls back to mailto when no endpoint is configured", async () => {
    vi.stubEnv("VITE_CONTACT_ENDPOINT", "");
    const navigate = vi.fn();

    await expect(sendContact(valid, { navigate })).resolves.toEqual({ mode: "mailto" });
    expect(navigate).toHaveBeenCalledOnce();
    expect(navigate.mock.calls[0][0]).toMatch(/^mailto:/);
  });

  it("POSTs trimmed JSON to the endpoint when one is configured", async () => {
    vi.stubEnv("VITE_CONTACT_ENDPOINT", "http://localhost:5000/api/contact");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const navigate = vi.fn();

    const result = await sendContact({ ...valid, name: "  Sam  " }, { navigate });

    expect(result).toEqual({ mode: "api" });
    expect(navigate).not.toHaveBeenCalled();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("http://localhost:5000/api/contact");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual(valid);
  });

  it("rejects when the API answers with an error status", async () => {
    vi.stubEnv("VITE_CONTACT_ENDPOINT", "http://localhost:5000/api/contact");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    await expect(sendContact(valid)).rejects.toThrow("500");
  });
});
