import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { json, signToken } from "@/lib/auth";
import { User } from "@/models/User";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return json({ error: "Email and password are required" }, 400);
  }

  await connectDB();

  const user = await User.findOne({ email }).select("+passwordHash");
  // Same message for unknown email and wrong password.
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) return json({ error: "Invalid email or password" }, 401);

  const token = signToken({ userId: user.id, isAdmin: user.isAdmin });
  return json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
    },
  });
}
