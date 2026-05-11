import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { navigationLinks } from "@/constants";

const Header = ({ session }: { session: Session | null }) => {
  return (
    <header className="my-10 flex justify-between items-center gap-5">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/icons/logo.svg" alt="Arcadia logo" width={38} height={38} />
        <span className="font-bebas-neue text-2xl tracking-widest text-white hidden sm:block">
          Arcadia
        </span>
      </Link>

      <ul className="flex flex-row items-center gap-6">
        {session?.user &&
          navigationLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-light-100 hover:text-white transition-colors hidden md:block"
              >
                {link.label}
              </Link>
            </li>
          ))}

        {session?.user ? (
          <>
            <li>
              <Avatar className="size-9 ring-2 ring-dark-400 hover:ring-primary/50 transition-all cursor-pointer">
                <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                  {getInitials(session.user.name || "U")}
                </AvatarFallback>
              </Avatar>
            </li>

            <li>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button
                  variant="ghost"
                  className="text-light-100 hover:text-white hover:bg-dark-600 border border-dark-400 h-9 px-4 text-sm rounded-lg transition-colors"
                >
                  Sign Out
                </Button>
              </form>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-light-100 hover:text-white hover:bg-dark-600 border border-dark-400 h-9 px-4 text-sm rounded-lg transition-colors"
                >
                  Sign In
                </Button>
              </Link>
            </li>

            <li>
              <Link href="/sign-up">
                <Button className="bg-primary text-white hover:bg-primary/90 h-9 px-4 text-sm rounded-lg transition-all hover:scale-105 font-semibold">
                  Get Started
                </Button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
};

export default Header;
