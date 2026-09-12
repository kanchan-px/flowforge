import { getSession } from "@/lib/session";

export async function Greeting() {
  const session = await getSession();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  return (
    <div className="space-y-2">
      <p className="text-base font-medium text-blue-600">
        {greeting} 
      </p>

      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Welcome back, {session?.user.name}
      </h1>

      <p className="text-lg text-slate-500">
        Here&apos;s what&apos;s happening in your workspace today.
      </p>
    </div>
  );
}