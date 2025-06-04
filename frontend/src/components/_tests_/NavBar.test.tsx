import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("../AuthModal", () => ({
  default: ({ mode }: { mode: string; onClose: () => void }) => (
    <div data-testid="mock-auth-modal">MockAuthModal mode={mode}</div>
  ),
}));

const mockDispatch = vi.fn();

const useSelectorMock = vi.fn();
const useDispatchMock = () => mockDispatch;

vi.mock("react-redux", () => ({
  useSelector: (fn: any) => useSelectorMock(fn),
  useDispatch: () => useDispatchMock(),
}));

import NavBar from "../NavBar";
import { clearToken } from "@/store/authSlice";

describe("NavBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders Register and Login when no token is present", () => {
    useSelectorMock.mockImplementation((selector) =>
      selector({ auth: { token: null } })
    );

    render(<NavBar />);

    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).toBeNull();
  });

  test("clicking Register shows AuthModal in register mode", () => {
    useSelectorMock.mockImplementation((selector) =>
      selector({ auth: { token: null } })
    );

    render(<NavBar />);

    fireEvent.click(screen.getByText(/register/i));

    expect(screen.getByTestId("mock-auth-modal")).toHaveTextContent(
      /MockAuthModal mode=register/i
    );
  });

  test("clicking Login shows AuthModal in login mode", () => {
    useSelectorMock.mockImplementation((selector) =>
      selector({ auth: { token: null } })
    );

    render(<NavBar />);

    fireEvent.click(screen.getByText(/login/i));

    expect(screen.getByTestId("mock-auth-modal")).toHaveTextContent(
      /MockAuthModal mode=login/i
    );
  });

  test("renders Logout when token is present", () => {
    useSelectorMock.mockImplementation((selector) =>
      selector({ auth: { token: "some-jwt-token" } })
    );

    render(<NavBar />);

    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/register/i)).toBeNull();
    expect(screen.queryByText(/login/i)).toBeNull();
  });

  test("clicking Logout dispatches clearToken action", () => {
    useSelectorMock.mockImplementation((selector) =>
      selector({ auth: { token: "jwt-token" } })
    );

    render(<NavBar />);

    fireEvent.click(screen.getByText(/logout/i));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(clearToken());
  });
});
