import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

interface NavbarProps {
  userName: string;
}

export default function Navbar({ userName }: NavbarProps) {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user.role === "ADMIN";

  async function handleSignOut() {
    await authClient.signOut();
    navigate("/login");
  }

  return (
    <nav className="flex items-center justify-between px-6 h-15 bg-slate-800 text-white shadow">
      <div className="flex items-center gap-6">
        <span className="font-bold text-base tracking-tight">Ticket Management</span>
        {isAdmin && (
          <Link to="/users" className="text-sm text-slate-300 hover:text-white transition">
            Users
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300">{userName}</span>
        <button
          onClick={handleSignOut}
          className="px-3.5 py-1.5 text-sm text-slate-200 border border-slate-600 rounded-md hover:bg-slate-700 transition cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
