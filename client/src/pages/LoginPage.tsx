import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFields) {
    setServerError("");
    const { error } = await authClient.signIn.email(data);
    if (error) {
      setServerError(error.message ?? "Invalid credentials");
      return;
    }
    navigate("/");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Ticket Management</h1>
        <p style={styles.subtitle}>Sign in to your account</p>
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form} noValidate>
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              style={styles.input}
              {...register("email")}
            />
            {errors.email && <span style={styles.fieldError}>{errors.email.message}</span>}
          </div>
          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              style={styles.input}
              {...register("password")}
            />
            {errors.password && <span style={styles.fieldError}>{errors.password.message}</span>}
          </div>
          {serverError && <p style={styles.serverError}>{serverError}</p>}
          <button type="submit" disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
  },
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "380px",
  },
  title: {
    margin: "0 0 0.25rem",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#111827",
  },
  subtitle: {
    margin: "0 0 1.75rem",
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#374151",
  },
  input: {
    padding: "0.625rem 0.875rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.15s",
  },
  button: {
    marginTop: "0.5rem",
    padding: "0.7rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s",
  },
  fieldError: {
    color: "#dc2626",
    fontSize: "0.8rem",
  },
  serverError: {
    margin: 0,
    color: "#dc2626",
    fontSize: "0.875rem",
  },
};
