"use client";

import { useEffect, useState } from "react";
import { AUTH_EVENT } from "@/lib/auth-events";
import type { SessionUser } from "@/lib/session-types";

export function useAuthState(): SessionUser | null | undefined {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    function fetchUser() {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (active) setUser(data.user ?? null);
        })
        .catch(() => {
          if (active) setUser(null);
        });
    }
    fetchUser();
    window.addEventListener(AUTH_EVENT, fetchUser);
    return () => {
      active = false;
      window.removeEventListener(AUTH_EVENT, fetchUser);
    };
  }, []);

  return user;
}
