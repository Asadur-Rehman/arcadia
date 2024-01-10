import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="admin-header">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          {session?.user?.name}
        </h2>
        <p className="text-base text-light-100 mt-1">
          Manage your library users, books, and borrow records
        </p>
      </div>
    </header>
  );
};

export default Header;
