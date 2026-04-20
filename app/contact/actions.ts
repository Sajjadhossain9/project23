"use server";

import { z } from "zod";

export interface ContactFormState {
  errors?: Record<string, string[]>;
  success?: boolean;
  error?: string;
}

const schema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .regex(
      /^(?:\+?880|0)?1[0-9]{9}$|^$/,
      "Enter a valid BD phone number (or leave blank)"
    )
    .optional(),
  service: z.string().max(60).optional(),
  budget: z.string().max(40).optional(),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)").max(3000),
});

export async function submitContactAction(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    service: formData.get("service") || undefined,
    budget: formData.get("budget") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const lead = parsed.data;

  try {
    // TODO: persist lead to DB when `Lead` model is added (trivial — mirror pricing-repo)
    // await prisma.lead.create({ data: lead });

    // TODO: email notification (uncomment when RESEND_API_KEY is set)
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await Promise.all([
    //   resend.emails.send({
    //     from: "leads@wevnix.com",
    //     to: "hello@wevnix.com",
    //     subject: `New lead: ${lead.name}`,
    //     text: JSON.stringify(lead, null, 2),
    //   }),
    //   resend.emails.send({
    //     from: "hello@wevnix.com",
    //     to: lead.email,
    //     subject: "Thanks — we got your message",
    //     text: `Hi ${lead.name},\n\nThanks for reaching out. We'll reply within one business day.\n\n— Wevnix`,
    //   }),
    // ]);

    // For now, log so the admin at least sees leads during dev
    console.log("[contact] new lead:", lead);

    return { success: true };
  } catch (err) {
    console.error("[contact]", err);
    return {
      error:
        "Sorry, something went wrong. Please try WhatsApp for a faster response.",
    };
  }
}
