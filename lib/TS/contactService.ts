// lib/TS/contactService.ts
// 🔁 注意这里是 "../"
import { supabase } from "./supabaseClient";

export type ContactRequestPayload = {
  name: string;
  email: string;
  messageType?: string;
  message: string;
};

export async function saveContactRequest(payload: ContactRequestPayload) {
  const { name, email, messageType, message } = payload;

  const { error } = await supabase
    .from("contact_requests")
    .insert({
      name,
      email,
      message_type: messageType || "other",
      message,
    });

  if (error) {
    throw new Error(`Supabase insert error: ${error.message}`);
  }
}