import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * requireAdmin helper for API routes.
 * Checks if the user is authenticated and has isAdmin = true.
 * Returns the user object if successful, or a NextResponse error if not.
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Unauthorized", status: 401 };
  }

  if (!session.user.isAdmin) {
    return { error: "Forbidden: Admin access required", status: 403 };
  }

  return { user: session.user };
}

/**
 * Standard error response for admin routes.
 */
export function adminError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
