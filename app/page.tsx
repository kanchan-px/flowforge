import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">
        Welcome to FlowForge 🚀
      </h1>

      <Button>
        Create Workspace
      </Button>
    </main>
  );
}