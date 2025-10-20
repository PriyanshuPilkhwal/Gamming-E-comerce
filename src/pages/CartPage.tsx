import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
//import { Input } from '@/components/ui/Input'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { Minus, Plus, Trash2} from 'lucide-react'

export function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCartStore()
  const subtotal = useCartStore((state) => state.getTotalPrice())
  const tax = subtotal * 0.08 // 8% mock tax
  const total = subtotal + tax

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-4xl font-bold text-primary">Your Cart is Empty</h1>
        <p className="mt-4 text-lg text-text-muted">
          Looks like you haven't added any games yet.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/browse">Start Browsing</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Cart Items */}
      <div className="flex-grow lg:w-2/3">
        <h1 className="mb-6 text-3xl font-bold">Your Cart ({items.length})</h1>
        <div className="flex flex-col gap-4">
          {items.map(({ game, quantity }) => (
            <div
              key={game.id}
              className="flex flex-col gap-4 rounded-lg border border-white/10 bg-card p-4 sm:flex-row"
            >
              <img
                src={game.images[0]}
                alt={game.title}
                className="h-32 w-full rounded-md object-cover sm:h-24 sm:w-24"
              />
              <div className="flex flex-grow flex-col">
                <Link to={`/product/${game.slug}`} className="text-lg font-semibold hover:text-primary">
                  {game.title}
                </Link>
                <p className="text-sm text-text-muted">{game.platforms.join(', ')}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => updateQuantity(game.id, quantity - 1)}
                      disabled={quantity === 1}
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="w-8 text-center text-lg font-medium">{quantity}</span>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => updateQuantity(game.id, quantity + 1)}
                      disabled={quantity >= game.stock}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <span className="text-lg font-medium">
                    {formatCurrency(game.price * quantity)}
                  </span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-text-muted hover:text-red-500"
                onClick={() => removeFromCart(game.id)}
              >
                <Trash2 size={20} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <aside className="lg:w-1/3">
        <div className="sticky top-24 rounded-lg border border-white/10 bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold">Order Summary</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Tax (8%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="my-2 border-t border-white/10"></div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <Button asChild size="lg" className="mt-6 w-full text-lg">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </aside>
    </div>
  )
}