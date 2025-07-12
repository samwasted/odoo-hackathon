import { auth } from "../../../../../../auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { message, skillsOffered, skillsWanted } = await req.json();

    if (!message || !Array.isArray(skillsOffered) || !Array.isArray(skillsWanted)) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const adminUser = await db.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!adminUser) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    const allUsers = await db.user.findMany({
      where: {
        isPublic: true,
        id: { not: adminUser.id } // avoid sending to self
      }
    });

    const notifications = allUsers.map(user => ({
      senderId: adminUser.id,
      receiverId: user.id,
      message,
      skillsOffered,
      skillsWanted
    }));

    const created = await db.notification.createMany({
      data: notifications
    });

    return NextResponse.json({ success: true, count: created.count });
  } catch (error) {
    console.error("SEND-ALL NOTIFICATION ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
