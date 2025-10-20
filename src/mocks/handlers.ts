import { http, HttpResponse, delay } from 'msw'
import { db } from './db.ts'

export const handlers = [
  // Get all games
  http.get('/api/games', async () => {
    await delay(500) // Simulate network delay
    return HttpResponse.json(db)
  }),

  // Get a single game by slug
  http.get('/api/games/:slug', async ({ params }) => {
    const { slug } = params
    const game = db.find((g) => g.slug === slug)

    if (!game) {
      await delay(500)
      return new HttpResponse(null, { status: 404 })
    }

    await delay(500)
    return HttpResponse.json(game)
  }),

  // Mock checkout
  http.post('/api/checkout', async ({ request }) => {
    const data = await request.json() as { total: number }
    await delay(2000) // Simulate payment processing

    // Simulate a random failure
    if (Math.random() < 0.1) {
      return new HttpResponse(JSON.stringify({ message: 'Payment failed' }), { status: 500 })
    }

    // Return mock order confirmation
    return HttpResponse.json({
      success: true,
      orderId: `GS-${Math.floor(Math.random() * 90000) + 10000}`,
      total: data.total,
    })
  }),
]