export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

interface AuthRequest {
  email: string;
  password: string;
}

export async function registerUser({
  email,
  password,
}: AuthRequest): Promise<AuthResponse> {
  const res = await fetch(`http://localhost:4000/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Registration failed");
  }

  return res.json();
}

export async function loginUser({
  email,
  password,
}: AuthRequest): Promise<AuthResponse> {
  const res = await fetch(`http://localhost:4000/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }

  return res.json();
}
