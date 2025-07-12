import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      db.user.findMany({
        where: { isPublic: true },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          skillsWanted: true,
          skillsOffered: true,
        },
      }),
      db.user.count({ where: { isPublic: true } }),
    ]);

    return NextResponse.json({
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/user/public error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
