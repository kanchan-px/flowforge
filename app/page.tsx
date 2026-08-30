import { getSession } from "@/lib/session";

export default async function HomePage() {
  const session = await getSession();

  console.log(session);

  return (
    <div className="p-10">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )}