import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { db, withDbRetry } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  // redirect() throws internally — TypeScript doesn't narrow optional chains
  // through it, so we extract the id explicitly after the guard.
  const userId = session.user!.id!;

  const isAdmin = await withDbRetry(() =>
    db
      .select({ isAdmin: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then((res) => res[0]?.isAdmin === "ADMIN"),
  );

  if (!isAdmin) redirect("/");

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />

      <div className="admin-container">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};
export default Layout;
