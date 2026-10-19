import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";
import type { AdminOut, MessageOut } from "@/lib/types";

export function useAdminSession() {
  return useQuery({ queryKey: ["admin", "me"], queryFn: () => apiGet<AdminOut>("/auth/me"), retry: false, staleTime: 60 * 1000 });
}

export function useEndSession() {
  const queryClient = useQueryClient();
  return async () => {
    try { await apiPost<MessageOut>("/auth/logout"); } finally { queryClient.clear(); }
  };
}
