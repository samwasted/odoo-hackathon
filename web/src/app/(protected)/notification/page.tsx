"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  skillsOffered: string[];
  skillsWanted: string[];
  sender: {
    name: string;
    email: string;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); 
  const [total, setTotal] = useState(0);

  const fetchNotifications = async () => {
  try {
    const offset = (page - 1) * limit;
    const res = await fetch(`/api/notification?limit=${limit}&offset=${offset}`);
    const result = await res.json();

    if (!Array.isArray(result.notifications)) {
      console.error("Invalid notifications response:", result);
      return;
    }

    setNotifications(result.notifications);

    result.notifications.forEach((notif: Notification) => {
      if (!notif.isRead) markAsRead(notif.id);
    });
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
  }
};

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notification/${id}/markRead`, {
        method: "PATCH",
      });
    } catch (err) {
      console.error(`Failed to mark notification ${id} as read`, err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6"> Notifications</h1>

      {notifications.length === 0 && (
        <p className="text-gray-500 text-sm">No notifications found.</p>
      )}

      <ul className="space-y-4">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className={`p-4 rounded-md shadow-sm border ${
              notif.isRead ? "bg-white" : "bg-blue-50"
            }`}
          >
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">{notif.sender.name}</span> (
              {notif.sender.email}) sent you a message:
            </p>
            <p className="text-sm italic text-zinc-800 mb-2">"{notif.message}"</p>
            <p className="text-xs text-gray-500">
              Offered: {notif.skillsOffered.join(", ") || "—"} | Wanted:{" "}
              {notif.skillsWanted.join(", ") || "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(notif.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      
      <div className="flex justify-center gap-4 mt-6">
        <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Previous
        </Button>
        <span className="self-center text-sm text-gray-600">Page {page}</span>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={notifications.length < limit}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
