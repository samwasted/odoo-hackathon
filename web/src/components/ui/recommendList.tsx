"use client";

import { useEffect, useState } from "react";

interface Rec { id: string; score: number; }
interface User { id: string; name?: string; email?: string; }

export default function RecommendList({ userId }: { userId: string }) {
  const [offersToYou, setOffersToYou] = useState<Rec[]>([]);
  const [wantYourOffers, setWantYourOffers] = useState<Rec[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/user/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const { offersToYou, wantYourOffers } = await res.json();

      const allIds = [...new Set([
        ...offersToYou.map((r: { id: any; }) => r.id),
        ...wantYourOffers.map((r: { id: any; }) => r.id),
      ])];

      const users: Record<string, User> = {};
      await Promise.all(allIds.map(async id => {
        const u = await (await fetch(`/api/user/${id}`)).json();
        users[id] = u;
      }));

      setUsersMap(users);
      setOffersToYou(offersToYou);
      setWantYourOffers(wantYourOffers);
    })();
  }, [userId]);

  return (
    <div>
      <section>
        <h3>Users Offering Skills You Want</h3>
        {offersToYou.length === 0 && <p>No matches here yet.</p>}
        <ul>
          {offersToYou.map(r => {
            const u = usersMap[r.id];
            return (
              <li key={r.id}>
                <strong>{u?.name}</strong> ({u?.email}) — Score {r.score}
              </li>
            );
          })}
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3>Users Wanting Skills You Offer</h3>
        {wantYourOffers.length === 0 && <p>No matches here yet.</p>}
        <ul>
          {wantYourOffers.map(r => {
            const u = usersMap[r.id];
            return (
              <li key={r.id}>
                <strong>{u?.name}</strong> ({u?.email}) — Score {r.score}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
