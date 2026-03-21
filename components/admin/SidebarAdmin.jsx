"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

import {
  Home,
  Plus,
  BookOpen,
  Heart,
  CreditCard,
  Mail,
  LogOut,
  Megaphone,
  ChevronRight,
  LifeBuoy,
  Users,
  Layout
} from "lucide-react";

const SidebarAdmin = () => {
  const pathname = usePathname();
  const router = useRouter();

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
        const data = await response.json();
        toast.error(`Logout failed: ${data.message}`, { id: "logout" });
      }
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`, { id: "logout" });
    }
  };

  const menuSections = [
    {
      title: "Overview",
      items: [
        {
          icon: Home,
          label: "Dashboard",
          href: "/admin",
          badge: null,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          icon: Users,
          label: "Users",
          href: "/admin/users",
          badge: null,
        },
        {
          icon: BookOpen,
          label: "Products",
          href: "/admin/products",
          badge: null,
        },
      ],
    },
  ];

  return (
    <motion.div
      className="w-[240px] h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-10 shrink-0"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-8 pb-6 bg-gray-50">
        <div className="flex items-center gap-3">
          
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Rubenius <span className="text-emerald-600">CMS</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4">
        <div className="py-2 space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="px-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isSelected = item.href === '/admin'
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link key={itemIndex} href={item.href} passHref>
                      <SidebarItem
                        icon={item.icon}
                        label={item.label}
                        badge={item.badge}
                        selected={isSelected}
                      />
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Support Card & Logout */}
      <div className="p-4 mt-auto space-y-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all font-bold text-sm shadow-lg shadow-red-200"
        >
          <LogOut className="h-4 w-4 mr-4" />
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

const SidebarItem = ({
  icon: Icon,
  label,
  badge,
  selected,
  onClick,
}) => {
  return (
    <div
      className={`relative group cursor-pointer rounded-xl transition-all duration-300 my-1 font-medium ${selected
          ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-200"
          : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
        }`}
    >
      <div className="flex items-center px-4 py-3">
        <Icon className={`h-4 w-4 transition-transform duration-200 ${selected ? 'scale-110' : 'group-hover:scale-110'}`} />

        <span className="ml-4 text-[13px] tracking-wide">{label}</span>

        {badge && (
          <Badge
            variant="outline"
            className={`ml-3 text-[10px] px-1.5 py-0 items-center justify-center flex uppercase tracking-wider border ${selected
              ? "border-emerald-300 text-white bg-emerald-500/50"
              : "border-slate-200 text-slate-500"
              }`}
          >
            {badge}
          </Badge>
        )}

        {selected && (
          <ChevronRight className="ml-auto h-4 w-4" />
        )}
      </div>
    </div>
  );
};

export default SidebarAdmin;
