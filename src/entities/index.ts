import { superdevClient } from "@/lib/superdev/client";

export const User = superdevClient.auth;

export const AISuggestion = superdevClient.entity("AISuggestion");
export const Deadline = superdevClient.entity("Deadline");
export const Document = superdevClient.entity("Document");
export const Entity = superdevClient.entity("Entity");
export const Notification = superdevClient.entity("Notification");