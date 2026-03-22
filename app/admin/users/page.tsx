"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { DataTable } from "@/components/admin/DataTable";
import { columns, UserColumn } from "./columns";

const UsersPage = () => {
  const [users, setUsers] = useState<UserColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/users`, {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        const formattedUsers: UserColumn[] = data.map((item: any) => ({
          id: item.id,
          name: item.name || "",
          email: item.email,
          createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Users fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-black">Users ({users.length})</h2>
        </div>
        <DataTable searchKey="email" columns={columns} data={users} />
      </div>
    </div>
  );
};

export default UsersPage;