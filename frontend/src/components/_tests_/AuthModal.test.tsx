import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import AuthModal from "../AuthModal";

vi.mock("@/api/auth", () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
}));

import { registerUser, loginUser } from "@/api/auth";

const mockDispatch = vi.fn();
vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

import { setToken } from "@/store/authSlice";

describe("AuthModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders with 'Register' title when mode='register'", () => {
    render(<AuthModal mode="register" onClose={mockOnClose} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /register/i
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  test("renders with 'Login' title when mode='login'", () => {
    render(<AuthModal mode="login" onClose={mockOnClose} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /login/i
    );
  });

  test("calls onClose when Cancel button is clicked", () => {
    render(<AuthModal mode="login" onClose={mockOnClose} />);

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(registerUser).not.toHaveBeenCalled();
    expect(loginUser).not.toHaveBeenCalled();
  });

  test("successful registration: calls registerUser, dispatches setToken, and calls onClose", async () => {
    (registerUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      token: "mockToken123",
      user: { id: "abc", email: "new@example.com" },
    });

    render(<AuthModal mode="register" onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "password123",
      });
    });

    expect(mockDispatch).toHaveBeenCalledWith(setToken("mockToken123"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/authentication failed/i)).toBeNull();
  });

  test("failed registration: shows error message when registerUser rejects", async () => {
    (registerUser as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Email already in use")
    );

    render(<AuthModal mode="register" onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        email: "existing@example.com",
        password: "password123",
      });
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(screen.getByText(/email already in use/i)).toBeInTheDocument();
  });

  test("successful login: calls loginUser, dispatches setToken, and calls onClose", async () => {
    (loginUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      token: "loginToken456",
      user: { id: "user123", email: "user@example.com" },
    });

    render(<AuthModal mode="login" onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "secret",
      });
    });

    expect(mockDispatch).toHaveBeenCalledWith(setToken("loginToken456"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("failed login: shows error message when loginUser rejects", async () => {
    (loginUser as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Invalid credentials")
    );

    render(<AuthModal mode="login" onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "wrong@example.com",
        password: "wrongpass",
      });
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
