import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export type AuthPayload = {
  userId: string;
  isAdmin: boolean;
};

const EXPIRES_IN = "7d";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set. Add it to .env.local");
  return secret;
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret());
    if (typeof decoded === "string") return null;
    const { userId, isAdmin } = decoded as Partial<AuthPayload>;
    if (typeof userId !== "string") return null;
    return { userId, isAdmin: isAdmin === true };
  } catch {
    return null; // expired, tampered or malformed
  }
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

/**
 * Auth middleware for route handlers.
 *   - no/invalid token  -> 401
 *   - adminOnly and token says isAdmin = false -> 403
 * On success the handler receives the verified payload as its last argument.
 */
export function withAuth<C = unknown>(
  handler: (
    req: NextRequest,
    ctx: C,
    auth: AuthPayload
  ) => Promise<Response> | Response,
  options: { adminOnly?: boolean } = {}
) {
  return async (req: NextRequest, ctx: C): Promise<Response> => {
    const header = req.headers.get("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    const auth = token ? verifyToken(token) : null;

    if (!auth) return json({ error: "Not authenticated" }, 401);
    if (options.adminOnly && !auth.isAdmin) {
      return json({ error: "Admin access required" }, 403);
    }
    return handler(req, ctx, auth);
  };
}
