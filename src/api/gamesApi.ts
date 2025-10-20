import { useQuery, useMutation } from '@tanstack/react-query'
import { Game, CartItem } from '@/types'
import { CheckoutFormData } from '@/lib/schemas'

// Base fetcher
const apiClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(endpoint, options)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

// GET all games
export const useGetGames = () => {
  return useQuery<Game[], Error>({
    queryKey: ['games'],
    queryFn: () => apiClient<Game[]>('/api/games'),
  })
}

// GET game by slug
export const useGetGameBySlug = (slug: string | undefined) => {
  return useQuery<Game, Error>({
    queryKey: ['game', slug],
    queryFn: () => apiClient<Game>(`/api/games/${slug}`),
    enabled: !!slug, // Only run query if slug is defined
  })
}

// POST to checkout
type CheckoutPayload = {
  items: CartItem[];
  formData: CheckoutFormData;
  total: number;
}
type CheckoutResponse = {
  orderId: string;
  success: boolean;
  total: number;
}
export const useCheckout = () => {
  return useMutation<CheckoutResponse, Error, CheckoutPayload>({
    mutationFn: (payload) => 
      apiClient<CheckoutResponse>('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }),
  })
}