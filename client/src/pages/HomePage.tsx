export default function HomePage() {
  return (
    <main style={styles.main}>
      <h2 style={styles.heading}>Dashboard</h2>
      <p style={styles.sub}>Your support tickets will appear here.</p>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    padding: "2rem 1.5rem",
  },
  heading: {
    margin: "0 0 0.5rem",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#111827",
  },
  sub: {
    color: "#6b7280",
    margin: 0,
  },
};
