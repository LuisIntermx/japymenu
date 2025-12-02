import { useQuery } from "@tanstack/react-query";
import { getMenu } from "@/app/features/menu/api/get";
import { Menu } from "@/types/menu";

export function useMenu() {
  return useQuery<Menu[]>({
    queryKey: ["menu"],
    queryFn: () => getMenu(),
    staleTime: 1000 * 60 * 5,
  });
}
