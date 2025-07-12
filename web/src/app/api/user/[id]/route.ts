import { getUserById } from "@/data/user";
import { auth } from "../../../../../auth";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const targetUser = await getUserById(userId);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const session = await auth();
    const isSelf = session?.user?.email === targetUser.email;
    const isAdmin = String(session?.user?.role) === "ADMIN";

    if (!targetUser.isPublic && !isSelf && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(targetUser, { status: 200 });
  } catch (error) {
    console.error("GET /api/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
