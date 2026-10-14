import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { json, signToken } from "@/lib/auth";
import { User } from "@/models/User";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  // NOTE: isAdmin is deliberately never read from the request.
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const password = String(body.password ?? "");

  if (!name) return json({ error: "Name is required" }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: "Enter a valid email" }, 400);
  if (!phone) return json({ error: "Phone is required" }, 400);
  if (password.length < 6) {
    return json({ error: "Password must be at least 6 characters" }, 400);
  }

  await connectDB();

  if (await User.exists({ email })) {
    return json({ error: "An account with this email already exists" }, 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let user;
  try {
    user = await User.create({ name, email, phone, passwordHash, isAdmin: false });
  } catch (err) {
    // Two signups racing past the exists() check hit the unique index.
    if ((err as { code?: number }).code === 11000) {
      return json({ error: "An account with this email already exists" }, 409);
    }
    throw err;
  }

  const token = signToken({ userId: user.id, isAdmin: false });
  return json(
    {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: false,
      },
    },
    201
  );
}
