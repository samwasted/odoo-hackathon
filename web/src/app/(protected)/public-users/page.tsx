"use client";

import { useEffect, useState } from "react";
import UserCard from "@/components/user/user-card";
import { Button } from "@/components/ui/button";

interface PublicUser {
  id: string;
  name: string;
  image?: string;
  skillsOffered: string[];
  skillsWanted: string[];
}

export default function PublicUsersPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/user/public?page=${page}&limit=${limit}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  return (
    <div className="w-full px-4 sm:px-6 md:px-12 lg:px-24">
      <h1 className="text-2xl font-bold mb-4">Explore Public Users</h1>

      <div className="grid gap-4 grid-cols-1 ">
        {users.map((user) => (
          <UserCard
            key={user.id}
            {...user}
            onRequest={() => alert(`Send request to ${user.name}`)}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="self-center text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
