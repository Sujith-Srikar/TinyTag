import "../styles/landing.scss";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="landing-layout">{children}</div>;
}
