import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/authSlice";
import { registerUser, loginUser, type AuthResponse } from "@/api/auth";

interface Props {
  mode: "login" | "register";
  onClose: () => void;
}

export default function AuthModal({ mode, onClose }: Props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    try {
      let data: AuthResponse;
      if (mode === "register") {
        data = await registerUser({ email, password });
      } else {
        data = await loginUser({ email, password });
      }

      dispatch(setToken(data.token));
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">
          {mode === "login" ? "Login" : "Register"}
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="w-full mb-2 p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full mb-2 p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button onClick={onClose} className="text-gray-600 px-4 py-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
