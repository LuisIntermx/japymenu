import { useQuery } from "@tanstack/react-query";
import { getMenuItem } from "@/app/features/menu/api/getById";
import { Menu } from "@/types/menu";

export function useMenuItem(id: string) {
  return useQuery<Menu>({
    queryKey: ["menu", id],
    queryFn: () => getMenuItem(id),
    staleTime: 1000 * 60 * 5,
  });
}
