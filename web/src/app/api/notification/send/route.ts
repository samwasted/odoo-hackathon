import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderEmail = session.user.email;
    const body = await req.json();
    const { receiverEmail, message, skillsOffered, skillsWanted } = body;

    if (!receiverEmail || !message) {
      return NextResponse.json({ error: "Missing receiverEmail or message" }, { status: 400 });
    }

    const sender = await getUserByEmail(senderEmail);
    const receiver = await getUserByEmail(receiverEmail);

    if (!sender || !receiver) {
      return NextResponse.json({ error: "Sender or receiver not found" }, { status: 404 });
    }

    const notification = await db.notification.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        message,
        skillsOffered,
        skillsWanted,
      },
    });

    return NextResponse.json(notification, { status: 201 });

  } catch (error) {
    console.error("POST /api/notification/send error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
