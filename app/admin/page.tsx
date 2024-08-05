import React from "react";
import { db, withDbRetry } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { count, eq, desc } from "drizzle-orm";
import dayjs from "dayjs";
import Link from "next/link";
import BookCover from "@/components/BookCover";

const StatCard = ({
  label,
  count: value,
  icon,
  href,
}: {
  label: string;
  count: number;
  icon: string;
  href?: string;
}) => (
  <div className="stat">
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="stat-count">{value.toLocaleString()}</p>
    {href && (
      <Link href={href} className="text-xs text-primary hover:underline">
        View all →
      </Link>
    )}
  </div>
);

const Page = async () => {
  const [[{ total: totalBooks }], [{ total: totalUsers }], [{ total: activeBorrows }], [{ total: pendingRequests }]] =
    await Promise.all([
      withDbRetry(() => db.select({ total: count() }).from(books)),
      withDbRetry(() => db.select({ total: count() }).from(users)),
      withDbRetry(() =>
        db
          .select({ total: count() })
          .from(borrowRecords)
          .where(eq(borrowRecords.status, "BORROWED")),
      ),
      withDbRetry(() =>
        db
          .select({ total: count() })
          .from(users)
          .where(eq(users.status, "PENDING")),
      ),
    ]);

  const recentActivity = await withDbRetry(() =>
    db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        status: borrowRecords.status,
        dueDate: borrowRecords.dueDate,
        userName: users.fullName,
        bookTitle: books.title,
        bookCoverColor: books.coverColor,
        bookCoverUrl: books.coverUrl,
        bookAuthor: books.author,
      })
      .from(borrowRecords)
      .leftJoin(users, eq(borrowRecords.userId, users.id))
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .orderBy(desc(borrowRecords.borrowDate))
      .limit(6),
  );

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Dashboard Overview
        </h2>
        <div className="flex flex-wrap gap-4">
          <StatCard
            label="Total Books"
            count={totalBooks}
            icon="📚"
            href="/admin/books"
          />
          <StatCard label="Total Members" count={totalUsers} icon="👤" href="/admin/users" />
          <StatCard
            label="Active Borrows"
            count={activeBorrows}
            icon="🔖"
            href="/admin/book-requests"
          />
          <StatCard
            label="Pending Approvals"
            count={pendingRequests}
            icon="⏳"
            href="/admin/account-requests"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent Borrow Activity
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-light-100">No borrow activity yet.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((record) => (
              <div key={record.id} className="book-stripe">
                <div className="shrink-0">
                  <BookCover
                    coverColor={record.bookCoverColor ?? "#6366F1"}
                    coverImage={record.bookCoverUrl ?? ""}
                    variant="extraSmall"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="title">{record.bookTitle ?? "Unknown Book"}</p>
                  <div className="author">
                    <p>{record.bookAuthor ?? "—"}</p>
                  </div>
                  <div className="user mt-2 flex flex-wrap gap-4">
                    <div className="avatar">
                      <p className="text-xs text-light-200">
                        👤 {record.userName ?? "Unknown User"}
                      </p>
                    </div>
                    <div className="borrow-date">
                      <p className="text-xs text-light-200">
                        📅 {dayjs(record.borrowDate).format("MMM D, YYYY")}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          record.status === "BORROWED"
                            ? "bg-blue-100/20 text-blue-100"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {record.status === "BORROWED" ? "Borrowed" : "Returned"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
