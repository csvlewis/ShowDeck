import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret"; // replace for production

// Register a new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    res.status(409).json({ error: "User already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({ email, password: passwordHash })
    .returning();

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res
    .status(201)
    .json({ token, user: { id: newUser.id, email: newUser.email } });
});

// Login existing user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

  res.status(200).json({ token, user: { id: user.id, email: user.email } });
});

export default router;
