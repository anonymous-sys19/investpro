import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Dashboard } from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
}
