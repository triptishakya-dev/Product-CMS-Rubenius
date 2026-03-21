"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const NavbarAdmin = ({ className }) => {
  const router = useRouter();
  const [admin, setAdmin] = useState({ fullName: "Loading...", email: "..." });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch("/api/auth/me"); // Updated path
        if (response.ok) {
          const data = await response.json();
          setAdmin(data.user);
        } else {
          console.error("Failed to fetch admin info");
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };

    fetchAdminInfo();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    toast.loading("Logging out...", { id: "logout" });
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        toast.success("Logged out successfully!", { id: "logout" });
        router.push("/admin/login");
      } else {
        toast.error("Logout failed", { id: "logout" });
      }
    } catch (error) {
      toast.error("An error occurred during logout", { id: "logout" });
    }
  };

  return (
    <nav className={`h-16 bg-gray-50 border-b border-slate-200 flex items-center justify-end px-6 transition-colors duration-300 relative z-50 ${className}`}>
      <div className="flex items-center space-x-6">
        {/* Actions */}
        

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200"></div>

        {/* Profile Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-1.5 rounded-xl transition-all duration-200"
          >
            <div className="h-9 w-9 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm uppercase shadow-sm border border-emerald-200">
              {admin.fullName && admin.fullName !== "Loading..."
                ? admin.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                : "AD"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-black leading-tight">
                {admin.fullName}
              </span>
              <span className="text-xs text-slate-500 leading-tight font-medium">
                {admin.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
