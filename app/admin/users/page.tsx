import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { DataTable } from "@/components/admin/DataTable";
import { columns, UserColumn } from "./columns";

const UsersPage = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedUsers: UserColumn[] = users.map((item: any) => ({
    id: item.id,
    name: item.name || "",
    email: item.email,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-black">Users ({users.length})</h2>
        </div>
        <DataTable searchKey="email" columns={columns} data={formattedUsers} />
      </div>
    </div>
  );
};

export default UsersPage;