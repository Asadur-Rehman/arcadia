import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db, withDbRetry } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import dayjs from "dayjs";
import BookCover from "@/components/BookCover";

const Page = async () => {
  const allBooks = await withDbRetry(() =>
    db.select().from(books).orderBy(desc(books.createdAt)),
  );

  return (
    <section className="w-full rounded-2xl bg-dark-300 p-7 border border-dark-400">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-7">
        <div>
          <h2 className="text-2xl font-semibold text-white">All Books</h2>
          <p className="text-light-100 mt-1">{allBooks.length} total books</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white" asChild>
          <Link href="/admin/books/new">+ Add New Book</Link>
        </Button>
      </div>

      {allBooks.length === 0 ? (
        <div className="py-16 text-center text-light-100">
          <p className="text-5xl mb-4">📚</p>
          <p className="text-lg font-medium text-light-200">No books yet</p>
          <p className="text-sm mt-1">Add your first book to get started.</p>
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
                  Author
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Genre
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Rating
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Copies
                </th>
                <th className="text-left py-3 pr-4 text-light-100 font-medium">
                  Added
                </th>
                <th className="text-left py-3 text-light-100 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allBooks.map((book) => (
                <tr
                  key={book.id}
                  className="border-b border-dark-400/40 hover:bg-dark-400/20 transition-colors"
                >
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <BookCover
                          coverColor={book.coverColor}
                          coverImage={book.coverUrl}
                          variant="extraSmall"
                        />
                      </div>
                      <p className="font-medium text-light-300 line-clamp-1 max-w-[180px]">
                        {book.title}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-light-100">{book.author}</td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center rounded-full bg-dark-400 px-2.5 py-1 text-xs font-medium text-light-200">
                      {book.genre}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-light-100">
                    ⭐ {book.rating}
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-light-100">
                      {book.availableCopies}
                      <span className="text-light-500"> / {book.totalCopies}</span>
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-light-100">
                    {book.createdAt
                      ? dayjs(book.createdAt).format("MMM D, YYYY")
                      : "—"}
                  </td>
                  <td className="py-4">
                    <Button className="view-btn text-xs py-1 h-8" asChild>
                      <Link href={`/admin/books/${book.id}`}>View</Link>
                    </Button>
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
