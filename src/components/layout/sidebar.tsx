"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useProfileContext } from "@/contexts/ProfileContext";
import {
  Home,
  PlusCircle,
  List,
  User,
  LogOut,
  Menu,
  X,
  Wallet,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Add Transaction", href: "/transactions/new", icon: PlusCircle },
  { name: "View Transactions", href: "/transactions", icon: List },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { profileData } = useProfileContext();

  const handleSignOut = () => {
    toast.success("Signed out successfully");
    signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white p-2 rounded-md shadow-md text-gray-900"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out lg:block`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-4 py-6">
            <Wallet className="h-8 w-8 text-green-400" />
            <h1 className="ml-2 text-xl font-bold">Budget Tracker</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="px-4 py-4 border-t border-gray-700">
            <div className="flex items-center mb-3">
              <div className="bg-gray-600 rounded-full p-2">
                <User className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {profileData?.name || "User"}
                </p>
                <p className="text-xs text-gray-300">{profileData?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
