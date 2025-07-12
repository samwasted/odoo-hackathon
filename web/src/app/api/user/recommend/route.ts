import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Body { userId: string; }

function jaccard(a: string[], b: string[]) {
  const setA = new Set(a), setB = new Set(b);
  const inter = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union ? inter / union : 0;
}

export async function POST(req: NextRequest) {
  const { userId } = (await req.json()) as Body;
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const current = await db.user.findUnique({
    where: { id: userId },
    select: { skillsWanted: true, skillsOffered: true, availability: true },
  });
  if (!current) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const others = await db.user.findMany({
    where: { isPublic: true, id: { not: userId } },
    select: { id: true, skillsOffered: true, skillsWanted: true, availability: true },
  });

  const offersToYou = [];
  const wantYourOffers = [];

  for (const u of others) {
    const score1 = jaccard(current.skillsWanted, u.skillsOffered) +
                   jaccard(current.skillsOffered, u.skillsWanted) * 0; 
    const score2 = jaccard(current.skillsOffered, u.skillsWanted) +
                   jaccard(current.skillsWanted, u.skillsOffered) * 0;

    const availBonus = (current.availability && u.availability && current.availability === u.availability) ? 0.1 : 0;

    if (score1 > 0) {
      offersToYou.push({ id: u.id, score: Math.round((score1 + availBonus) * 100) / 100 });
    }
    if (score2 > 0) {
      wantYourOffers.push({ id: u.id, score: Math.round((score2 + availBonus) * 100) / 100 });
    }
  }
  offersToYou.sort((a, b) => b.score - a.score);
  wantYourOffers.sort((a, b) => b.score - a.score);

  return NextResponse.json({ offersToYou, wantYourOffers });
}
