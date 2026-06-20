import { Sidebar } from "@/components/Layout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app-main">{children}</main>
    </div>
  );
}
