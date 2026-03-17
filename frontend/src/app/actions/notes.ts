"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * NOTEBOOK SERVER ACTIONS
 *
 * Persists saved explanations and study tips to Supabase.
 * Previously, notes were stored only in Zustand (localStorage),
 * meaning they were lost when the user cleared their browser or
 * switched devices. Now they persist across all devices.
 */

interface CreateNotePayload {
  title: string;
  content: string;
  type: "explanation" | "chat" | "tip" | "custom";
  subject?: string;
  questionRef?: string;
}

export async function createNote(payload: CreateNotePayload) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to save notes." };
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      title: payload.title,
      content: payload.content,
      type: payload.type,
      subject: payload.subject || null,
      question_ref: payload.questionRef || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Note creation error:", error);
    return { error: "Failed to save note." };
  }

  return { data };
}

export async function getNotes() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Failed to fetch notes." };
  }

  return { data };
}

export async function togglePinNote(noteId: string, isPinned: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("notes")
    .update({ is_pinned: isPinned })
    .eq("id", noteId);

  if (error) {
    return { error: "Failed to update note." };
  }

  return { success: true };
}

export async function deleteNote(noteId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    return { error: "Failed to delete note." };
  }

  return { success: true };
}
