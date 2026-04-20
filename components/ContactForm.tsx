"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { submitContactAction, type ContactFormState } from "@/app/contact/actions";

interface ContactFormProps {
  prefilledMessage?: string;
}

export function ContactForm({ prefilledMessage = "" }: ContactFormProps) {
  const [state, formAction] = useActionState<ContactFormState, FormData>(
    submitContactAction,
    {}
  );

  if (state.success) {
    return (
      <div className="rounded-lg border border-success/30 bg-success/5 p-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success mb-4">
          <CheckCircle2 size={24} aria-hidden="true" />
        </div>
        <h2 className="text-h3 text-fg">Thanks — we got it.</h2>
        <p className="mt-2 text-body text-fg-secondary">
          We&apos;ll reply within one business day, usually much sooner. Check your
          inbox for a confirmation.
        </p>
      </div>
    );
  }

  const err = (key: string) => state.errors?.[key]?.[0];

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" required error={err("name")} />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={err("email")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Phone (optional)"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          error={err("phone")}
        />
        <SelectField
          label="Service of interest"
          name="service"
          options={[
            { value: "", label: "Choose one (optional)" },
            { value: "software", label: "Software Development" },
            { value: "web", label: "Web Development" },
            { value: "app", label: "Mobile Apps" },
            { value: "ai", label: "AI Solutions" },
            { value: "hosting", label: "Hosting" },
            { value: "seo", label: "SEO & Marketing" },
          ]}
        />
      </div>

      <SelectField
        label="Budget range (optional)"
        name="budget"
        options={[
          { value: "", label: "Choose one" },
          { value: "under-25k", label: "Under ৳25,000" },
          { value: "25k-100k", label: "৳25,000 – ৳100,000" },
          { value: "100k-500k", label: "৳100,000 – ৳500,000" },
          { value: "500k+", label: "৳500,000+" },
          { value: "not-sure", label: "Not sure yet" },
        ]}
      />

      <Field
        label="Message"
        name="message"
        type="textarea"
        required
        defaultValue={prefilledMessage}
        placeholder="Tell us what you're building — the clearer the better."
        error={err("message")}
      />

      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/5 p-3 text-body-sm text-danger"
        >
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 h-12 px-6 rounded-md bg-brand text-fg-inverse font-medium hover:bg-brand-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          Sending…
        </>
      ) : (
        <>
          <Send size={16} aria-hidden="true" />
          Send message
        </>
      )}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  autoComplete,
  error,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  defaultValue?: string;
}) {
  const inputClass = `w-full px-3 bg-bg border rounded-md text-body text-fg placeholder:text-fg-tertiary focus:outline-none focus:ring-2 transition-colors ${
    error
      ? "border-danger focus:border-danger focus:ring-danger/30"
      : "border-border-default focus:border-accent focus:ring-accent/30"
  }`;

  return (
    <div>
      <label htmlFor={name} className="block text-caption text-fg-secondary mb-1.5">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={5}
          placeholder={placeholder}
          required={required}
          defaultValue={defaultValue}
          className={`${inputClass} py-3 leading-relaxed resize-y min-h-[120px]`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          className={`${inputClass} h-11`}
        />
      )}
      {error && (
        <p role="alert" className="mt-1.5 text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-caption text-fg-secondary mb-1.5">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="w-full h-11 px-3 pr-8 bg-bg border border-border-default rounded-md text-body text-fg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
