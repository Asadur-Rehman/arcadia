import { ReactNode } from "react";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (session) redirect("/");

  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row items-center gap-3">
            <Image src="/icons/logo.svg" alt="logo" width={37} height={37} />
            <h1 className="font-bebas-neue text-3xl tracking-wide text-white">
              Arcadia
            </h1>
          </div>

          <div>{children}</div>
        </div>
      </section>

      <section className="auth-illustration relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-100/70 z-10" />
        <Image
          src="/images/auth-illustration.png"
          alt="library illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12">
          <h2 className="font-bebas-neue text-5xl text-white tracking-widest">
            Arcadia
          </h2>
          <p className="text-light-100 text-sm mt-2 font-medium">
            NUST University Library Management System
          </p>
        </div>
      </section>
    </main>
  );
};

export default Layout;
