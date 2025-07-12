import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import {auth} from '../../../../../../auth'
import { NextResponse } from "next/server";

// GET /api/user/[id]/skills
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const targetUser = await getUserById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSelf = session?.user?.email === targetUser.email;
    const isAdmin = String(session?.user?.role) === "ADMIN";
    const isPublic = targetUser.isPublic;

    if (!isSelf && !isAdmin && !isPublic) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { id: id },
      select: { skillsOffered: true, skillsWanted: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/user/[id]/skills error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/user/[id]/skills
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const body = await req.json();
    const { skillsOffered, skillsWanted } = body;

    if (!Array.isArray(skillsOffered) || !Array.isArray(skillsWanted)) {
      return NextResponse.json({ error: "`skillsOffered` and `skillsWanted` must be arrays" }, { status: 400 });
    }

    const targetUser = await getUserById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSelf = targetUser.email === session.user.email;
    const isAdmin = String(session.user.role) === "ADMIN";
    if (!isSelf && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db.user.update({
      where: { id: id },
      data: {
        skillsOffered,
        skillsWanted,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/user/[id]/skills error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
