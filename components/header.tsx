'use client'
import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@/utils/authContext';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isClient, setIsClient] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.refresh();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header
      className="px-4 py-4 flex justify-between items-center w-full"
      style={{ boxShadow: '0px 1px 0px rgba(229, 231, 235, 0.5)' }}
    >
      <div className="flex-1">
        <Link href="/">
          <div className="cursor-pointer">
            <Image
              src="/räddit.png"
              alt="Räddit Logo"
              width={100}
              height={40}
            />
          </div>
        </Link>
      </div>

      <div className="flex-1 text-center">
        {/* <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="border rounded-full pl-10 pr-3 py-2 w-full text-sm text-white bg-gray-800"
          />
        </div> */}
      </div>

      <div className="flex-1 text-right">
        {isClient && (user ? (
          <div>
            <small className="mr-4">Logged in as: {user.userName}</small>
            <button
              className="bg-red-600 text-white rounded-full hover:bg-red-700 px-4 py-2 text-sm"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="bg-red-600 text-white rounded-full hover:bg-red-700 px-4 py-2 text-sm">
              Log in
            </button>
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;