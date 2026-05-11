import Link from "next/link";
import Image from "next/image";
import { BookOpen, Zap, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db, withDbRetry } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { count, countDistinct } from "drizzle-orm";

const features = [
  {
    icon: BookOpen,
    title: "Vast Collection",
    description:
      "Thousands of books across every discipline — from Computer Science and Engineering to Literature and Social Sciences.",
  },
  {
    icon: Zap,
    title: "Borrow Instantly",
    description:
      "Request and track books with a single click. Real-time availability, due dates, and digital borrow receipts.",
  },
  {
    icon: GraduationCap,
    title: "NUST Exclusive",
    description:
      "Built exclusively for NUST students and faculty. Verify with your university ID card to unlock full access.",
  },
];

const techStack = [
  "Next.js 15",
  "TypeScript",
  "PostgreSQL",
  "Drizzle ORM",
  "NextAuth v5",
  "Tailwind CSS",
  "Upstash Redis",
];

const LandingPage = async () => {
  const [[booksResult], [usersResult], [genresResult]] = await Promise.all([
    withDbRetry(() => db.select({ value: count() }).from(books)),
    withDbRetry(() => db.select({ value: count() }).from(users)),
    withDbRetry(() =>
      db.select({ value: countDistinct(books.genre) }).from(books),
    ),
  ]);

  const stats = [
    { value: booksResult?.value ?? 0, label: "Books in Collection" },
    { value: usersResult?.value ?? 0, label: "Registered Members" },
    { value: genresResult?.value ?? 0, label: "Genres Available" },
  ];

  return (
    <div className="flex flex-col gap-32 pb-20">
      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center pt-10 gap-8">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium tracking-wide">
          <Image src="/icons/logo.svg" alt="" width={16} height={16} />
          NUST University Library System
        </span>

        <h1
          className="font-bebas-neue text-[7rem] xs:text-[9rem] md:text-[12rem] leading-none tracking-widest text-white select-none"
          style={{
            textShadow:
              "0 0 60px rgba(99,102,241,0.55), 0 0 120px rgba(99,102,241,0.25), 0 0 200px rgba(99,102,241,0.1)",
          }}
        >
          ARCADIA
        </h1>

        <p className="max-w-2xl text-xl text-light-100 leading-relaxed -mt-4">
          Discover, borrow, and track thousands of books across every
          discipline — built exclusively for the NUST community.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/library">
            <Button className="bg-primary text-white hover:bg-primary/90 h-12 px-8 text-base rounded-lg transition-all hover:scale-105 font-semibold shadow-lg shadow-primary/20">
              Explore Library
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button
              variant="ghost"
              className="text-light-100 hover:text-white hover:bg-dark-600 border border-dark-400 h-12 px-8 text-base rounded-lg transition-colors"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="gradient-vertical border border-dark-400 hover:border-primary/40 rounded-2xl p-10 text-center transition-colors"
          >
            <p className="font-bebas-neue text-6xl text-primary tracking-wide">
              {stat.value.toLocaleString()}
            </p>
            <p className="mt-2 text-light-100 text-xs uppercase tracking-widest font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section className="flex flex-col gap-12">
        <div className="text-center">
          <p className="library-subtitle">Why Arcadia</p>
          <h2 className="mt-2 text-3xl xs:text-4xl font-semibold text-white">
            Everything you need, in one place
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="gradient-vertical border border-dark-400 hover:border-primary/40 rounded-2xl p-8 flex flex-col gap-5 transition-all hover:-translate-y-1 group"
            >
              <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-light-100 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="flex flex-col items-center gap-6">
        <p className="library-subtitle">Built With</p>
        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-lg bg-dark-300 border border-dark-400 text-light-200 text-sm font-medium hover:border-primary/30 hover:text-white transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden gradient-vertical border border-dark-400 rounded-2xl p-12 md:p-20 flex flex-col items-center text-center gap-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)",
          }}
        />

        <h2 className="relative text-3xl xs:text-4xl font-semibold text-white">
          Ready to start reading?
        </h2>
        <p className="relative text-light-100 text-lg max-w-md">
          Join the NUST library community and access thousands of books today.
        </p>

        <div className="relative flex flex-wrap justify-center gap-4">
          <Link href="/sign-up">
            <Button className="bg-primary text-white hover:bg-primary/90 h-12 px-10 text-base rounded-lg transition-all hover:scale-105 font-semibold shadow-lg shadow-primary/20">
              Create Account
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button
              variant="ghost"
              className="text-light-100 hover:text-white hover:bg-dark-600 border border-dark-400 h-12 px-8 text-base rounded-lg transition-colors"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
