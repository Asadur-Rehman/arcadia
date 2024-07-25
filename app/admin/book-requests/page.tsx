import React from "react";
import { db, withDbRetry } from "@/database/drizzle";
import { borrowRecords, users, books } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import dayjs from "dayjs";
import BookCover from "@/components/BookCover";

const statusStyles: Record<string, string> = {
  BORROWED: "bg-blue-100/20 text-blue-100",
  RETURNED: "bg-green-100 text-green-800",
};

const Page = async () => {
  const records = await withDbRetry(() =>
    db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
        userName: users.fullName,
        userEmail: users.email,
        bookTitle: books.title,
        bookCoverColor: books.coverColor,
        bookCoverUrl: books.coverUrl,
        bookAuthor: books.author,
        bookGenre: books.genre,
      })
      .from(borrowRecords)
      .leftJoin(users, eq(borrowRecords.userId, users.id))
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .orderBy(desc(borrowRecords.borrowDate)),
  );

  const activeCount = records.filter((r) => r.status === "BORROWED").length;

  return (
    <section className="w-full rounded-2xl bg-dark-300 p-7 border border-dark-400">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-7">
        <div>
          <h2 className="text-2xl font-semibold text-white">Borrow Requests</h2>
          <p className="text-light-100 mt-1">
            {records.length} total · {activeCount} active
          </p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="py-16 text-center text-light-100">
          <p className="text-5xl mb-4">🔖</p>
          <p className="text-lg font-medium text-light-200">
            No borrow records yet
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-400">
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Book
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Borrowed By
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Borrow Date
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Due Date
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Return Date
                </th>
                <th className="text-left py-3 text-light-100 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const isOverdue =
                  record.status === "BORROWED" &&
                  dayjs(record.dueDate).isBefore(dayjs(), "day");

                return (
                  <tr
                    key={record.id}
                    className="border-b border-dark-400/40 hover:bg-dark-400/20 transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          <BookCover
                            coverColor={record.bookCoverColor ?? "#6366F1"}
                            coverImage={record.bookCoverUrl ?? ""}
                            variant="extraSmall"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-light-300 line-clamp-1 max-w-[140px]">
                            {record.bookTitle ?? "Unknown"}
                          </p>
                          <p className="text-xs text-light-100 mt-0.5">
                            {record.bookAuthor ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <p className="text-light-300 font-medium">
                        {record.userName ?? "Unknown"}
                      </p>
                      <p className="text-xs text-light-100 mt-0.5">
                        {record.userEmail ?? "—"}
                      </p>
                    </td>
                    <td className="py-4 pr-4 text-light-100">
                      {record.borrowDate
                        ? dayjs(record.borrowDate).format("MMM D, YYYY")
                        : "—"}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={
                          isOverdue ? "text-red-400 font-medium" : "text-light-100"
                        }
                      >
                        {record.dueDate
                          ? dayjs(record.dueDate).format("MMM D, YYYY")
                          : "—"}
                        {isOverdue && (
                          <span className="ml-1 text-xs">(Overdue)</span>
                        )}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-light-100">
                      {record.returnDate
                        ? dayjs(record.returnDate).format("MMM D, YYYY")
                        : "—"}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[record.status] ?? "bg-dark-400 text-light-100"}`}
                      >
                        {record.status === "BORROWED" ? "Borrowed" : "Returned"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Page;
