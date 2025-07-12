import { auth } from "../../../../../../auth";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.id;
    const { isPublic } = await req.json();

    if (typeof isPublic !== "boolean") {
      return NextResponse.json({ error: "`isPublic` must be a boolean" }, { status: 400 });
    }

    const targetUser = await getUserById(userId);
    console.log(targetUser?.email)
    console.log(session.user.email)
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
if (targetUser.email !== session.user.email && String(session.user.role) !== 'ADMIN') {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isPublic },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("POST /api/user/[userId]/changevisibility error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
