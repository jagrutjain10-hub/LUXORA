import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await productApi.get(slug);
      return data.data;
    },
    staleTime: 120_000,
    enabled: !!slug,
  });
}
