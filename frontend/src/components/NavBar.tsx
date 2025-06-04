import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@/store";
import { clearToken } from "@/store/authSlice";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function NavBar() {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const [mode, setMode] = useState<"login" | "register" | null>(null);

  const handleLogout = () => {
    dispatch(clearToken());
  };

  return (
    <div className="flex justify-between p-4 bg-gray-800 text-white">
      <h2 className="text-xl font-bold">ShowDeck</h2>
      <div className="space-x-4">
        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <button onClick={() => setMode("register")}>Register</button>
            <button onClick={() => setMode("login")}>Login</button>
          </>
        )}
      </div>
      {mode && <AuthModal mode={mode} onClose={() => setMode(null)} />}
    </div>
  );
}
