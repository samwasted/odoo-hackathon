import { auth } from "../../../../auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const notifications = await db.notification.findMany({
      where: {
        receiverId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET /api/notification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
