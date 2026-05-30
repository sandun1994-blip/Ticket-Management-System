import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

interface NavbarProps {
  userName: string;
}

export default function Navbar({ userName }: NavbarProps) {
  const navigate = useNavigate();

  async function handleSignOut() {
    await authClient.signOut();
    navigate("/login");
  }

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>Ticket Management</span>
      <div style={styles.right}>
        <span style={styles.userName}>{userName}</span>
        <button onClick={handleSignOut} style={styles.signOutBtn}>
          Sign out
        </button>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1.5rem",
    height: "60px",
    background: "#1e293b",
    color: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
  },
  brand: {
    fontWeight: 700,
    fontSize: "1.1rem",
    letterSpacing: "0.01em",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userName: {
    fontSize: "0.9rem",
    color: "#cbd5e1",
  },
  signOutBtn: {
    padding: "0.4rem 0.9rem",
    background: "transparent",
    border: "1px solid #475569",
    borderRadius: "0.4rem",
    color: "#e2e8f0",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "background 0.15s",
  },
};
