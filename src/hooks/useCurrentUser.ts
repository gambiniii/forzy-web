import { useEffect, useState } from "react";
import { getMe } from "../services/auth.service";
import type { MeResponse } from "../services/auth.service";
import { getInitials } from "../utils/formatters";

export function useCurrentUser() {
  const [user, setUser] = useState<MeResponse | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => null);
  }, []);

  return { user, initials: getInitials(user?.name) };
}
