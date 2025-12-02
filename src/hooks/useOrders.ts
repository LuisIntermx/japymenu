import { useInfiniteQuery } from "@tanstack/react-query";
import { getActiveOrders } from "@/app/features/order/api/list";

const LIMIT = 5;

export const useActiveOrders = () =>
  useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: async ({ pageParam = 0 }) => getActiveOrders(pageParam, LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.result.length < LIMIT) return undefined;
      return allPages.length * LIMIT;
    },
    staleTime: 0,
    refetchInterval: 5000,
  });
