"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * ENTERPRISE AUTH ACTIONS
 *
 * These Server Actions handle all authentication logic on the server.
 * Passwords never touch the browser's JavaScript runtime.
 * All validation happens server-side before reaching Supabase.
 */

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;

  // Server-side validation
  if (!email || !password || !username) {
    return { error: "Email, password, and username are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username,
        full_name: `${firstName || ""} ${lastName || ""}`.trim(),
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Account created! Please check your email to confirm." };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const identifier = formData.get("identifier") as string;
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Email/Username and password are required." };
  }

  let email = identifier;

  // Resolve username to email if identifier is not an email
  if (!identifier.includes("@")) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", identifier)
      .single();

    if (profileError || !profile?.email) {
      return { error: "No account found with that username." };
    }
    email = profile.email;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Check for specific Supabase error: "Email not confirmed"
    if (error.message.toLowerCase().includes("email not confirmed") || 
        error.message.toLowerCase().includes("confirm your email")) {
      return { 
        error: "Email not confirmed.", 
        needsConfirmation: true,
        email 
      };
    }
    return { error: error.message };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}
