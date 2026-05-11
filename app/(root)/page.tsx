import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import LandingPage from "@/components/LandingPage";
import { db, withDbRetry } from "@/database/drizzle";
import { books } from "@/database/schema";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";

const Home = async () => {
  const session = await auth();

  if (!session) {
    return <LandingPage />;
  }

  const latestBooks = (await withDbRetry(() =>
    db.select().from(books).limit(10).orderBy(desc(books.createdAt)),
  )) as Book[];

  return (
    <>
      <BookOverview
        {...latestBooks[0]}
        userId={session?.user?.id ?? ""}
      />

      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
