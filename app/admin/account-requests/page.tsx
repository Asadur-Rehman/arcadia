import React from "react";
import { db, withDbRetry } from "@/database/drizzle";
import { users } from "@/database/schema";
import { desc } from "drizzle-orm";
import dayjs from "dayjs";
import AccountActions from "@/components/admin/AccountActions";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-400/20 text-amber-400",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-400/15 text-red-400",
};

const Page = async () => {
  const allUsers = await withDbRetry(() =>
    db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt)),
  );

  const pendingCount = allUsers.filter((u) => u.status === "PENDING").length;

  return (
    <section className="w-full rounded-2xl bg-dark-300 p-7 border border-dark-400">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-7">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Account Requests
          </h2>
          <p className="text-light-100 mt-1">
            {allUsers.length} total · {pendingCount} pending
          </p>
        </div>
      </div>

      {allUsers.length === 0 ? (
        <div className="py-16 text-center text-light-100">
          <p className="text-5xl mb-4">👤</p>
          <p className="text-lg font-medium text-light-200">
            No account requests yet
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-400">
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Name
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  University ID
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  ID Card
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Submitted
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Status
                </th>
                <th className="text-left py-3 text-light-100 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-dark-400/40 hover:bg-dark-400/20 transition-colors"
                >
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {user.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-light-300">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-light-100 mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-light-100 font-mono">
                    {user.universityId}
                  </td>
                  <td className="py-4 pr-4">
                    {user.universityCard ? (
                      <a
                        href={user.universityCard}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View card ↗
                      </a>
                    ) : (
                      <span className="text-xs text-light-500">Not provided</span>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-light-100">
                    {user.createdAt
                      ? dayjs(user.createdAt).format("MMM D, YYYY")
                      : "—"}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[user.status ?? "PENDING"]}`}
                    >
                      {(user.status ?? "PENDING").charAt(0) +
                        (user.status ?? "PENDING").slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="py-4">
                    {user.status === "PENDING" ? (
                      <AccountActions userId={user.id} />
                    ) : (
                      <span className="text-xs text-light-500">
                        No action needed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Page;
