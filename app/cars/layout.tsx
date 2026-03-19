import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";

export default async function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <Header username={session.username} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
