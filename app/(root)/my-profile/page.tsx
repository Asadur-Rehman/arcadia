import React from "react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { db, withDbRetry } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import BookCover from "@/components/BookCover";
import Link from "next/link";
import dayjs from "dayjs";

const Page = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  // redirect() throws internally — extract after guard so TypeScript is happy
  const userId = session.user!.id!;

  const borrowed = await withDbRetry(() =>
    db
      .select({
        recordId: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
        bookId: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverColor: books.coverColor,
        coverUrl: books.coverUrl,
      })
      .from(borrowRecords)
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.userId, userId))
      .orderBy(desc(borrowRecords.borrowDate)),
  );

  const activeCount = borrowed.filter((b) => b.status === "BORROWED").length;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-bebas-neue text-5xl text-light-300">
            My Profile
          </h1>
          <p className="text-light-100 mt-1">{session.user.name}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button
            variant="outline"
            className="border-dark-400 bg-dark-300 text-light-200 hover:bg-dark-600 hover:text-white transition-colors"
          >
            Sign Out
          </Button>
        </form>
      </div>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bebas-neue text-3xl text-light-100">
            Borrowed Books
          </h2>
          <span className="text-sm text-light-100">
            {activeCount} active · {borrowed.length} total
          </span>
        </div>

        {borrowed.length === 0 ? (
          <div className="rounded-2xl bg-dark-300 border border-dark-400 py-16 text-center">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-lg font-medium text-light-200">
              No books borrowed yet
            </p>
            <p className="text-sm text-light-100 mt-1">
              Browse the library and borrow your first book.
            </p>
            <Button
              className="mt-6 bg-primary hover:bg-primary/90 text-white"
              asChild
            >
              <Link href="/">Browse Books</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {borrowed.map((record) => {
              const isOverdue =
                record.status === "BORROWED" &&
                dayjs(record.dueDate).isBefore(dayjs(), "day");
              const daysLeft = dayjs(record.dueDate).diff(dayjs(), "day");

              return (
                <Link
                  key={record.recordId}
                  href={`/books/${record.bookId}`}
                  className="flex gap-4 rounded-2xl bg-dark-300 border border-dark-400 p-4 hover:bg-dark-400/50 transition-colors"
                >
                  <div className="shrink-0">
                    <BookCover
                      coverColor={record.coverColor ?? "#6366F1"}
                      coverImage={record.coverUrl ?? ""}
                      variant="small"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-light-300 line-clamp-2">
                      {record.title ?? "Unknown Book"}
                    </p>
                    <p className="text-sm text-light-100 mt-1">
                      {record.author ?? "—"}
                    </p>
                    <span className="mt-1 inline-block text-xs text-light-500">
                      {record.genre}
                    </span>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-light-100">
                        Borrowed:{" "}
                        {record.borrowDate
                          ? dayjs(record.borrowDate).format("MMM D, YYYY")
                          : "—"}
                      </p>
                      {record.status === "BORROWED" ? (
                        <p
                          className={`text-xs font-medium ${isOverdue ? "text-red-400" : "text-light-200"}`}
                        >
                          {isOverdue
                            ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""}`
                            : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left to return`}
                        </p>
                      ) : (
                        <p className="text-xs text-green-400">
                          Returned{" "}
                          {record.returnDate
                            ? dayjs(record.returnDate).format("MMM D, YYYY")
                            : ""}
                        </p>
                      )}
                    </div>
                    <span
                      className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        record.status === "BORROWED"
                          ? isOverdue
                            ? "bg-red-400/15 text-red-400"
                            : "bg-blue-100/20 text-blue-100"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {record.status === "BORROWED" ? "Borrowed" : "Returned"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
