import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { useCheckout } from '@/api/gamesApi'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const subtotal = getTotalPrice()
  const tax = subtotal * 0.08
  const total = subtotal + tax
  const navigate = useNavigate()

  const checkoutMutation = useCheckout()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmit = (data: CheckoutFormData) => {
    checkoutMutation.mutate(
      { items, formData: data, total },
      {
        onSuccess: (orderData) => {
          clearCart()
          navigate('/confirmation', { state: { orderId: orderData.orderId, total: orderData.total } })
        },
        onError: (error) => {
          console.error('Checkout failed', error)
          // TODO: Show an error message to the user
        },
      },
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-center text-4xl font-bold text-primary">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12 lg:flex-row">
        {/* Form Details */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Contact & Shipping</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
                <Input id="email" {...register('email')} />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">Full Name</label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="address" className="mb-1 block text-sm font-medium">Address</label>
                <Input id="address" {...register('address')} />
                {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Payment Details (Mock)</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="card" className="mb-1 block text-sm font-medium">Card Number</label>
                <Input id="card" placeholder="4242 4242 4242 4242" {...register('cardNumber')} />
                {errors.cardNumber && <p className="mt-1 text-sm text-red-400">{errors.cardNumber.message}</p>}
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label htmlFor="expiry" className="mb-1 block text-sm font-medium">Expiry (MM/YY)</label>
                  <Input id="expiry" placeholder="MM/YY" {...register('expiryDate')} />
                  {errors.expiryDate && <p className="mt-1 text-sm text-red-400">{errors.expiryDate.message}</p>}
                </div>
                <div className="w-1/2">
                  <label htmlFor="cvc" className="mb-1 block text-sm font-medium">CVC</label>
                  <Input id="cvc" placeholder="123" {...register('cvc')} />
                  {errors.cvc && <p className="mt-1 text-sm text-red-400">{errors.cvc.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <aside className="lg:w-2/5">
          <div className="sticky top-24 rounded-lg border border-white/10 bg-card p-6">
            <h2 className="mb-4 text-2xl font-semibold">Order Summary</h2>
            <div className="flex flex-col gap-2">
              {items.map(({ game, quantity }) => (
                <div key={game.id} className="flex justify-between text-sm">
                  <span>{game.title} x {quantity}</span>
                  <span>{formatCurrency(game.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="my-4 border-t border-white/10"></div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="my-2 border-t border-white/10"></div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <Button
              size="lg"
              type="submit"
              className="mt-6 w-full text-lg"
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? (
                <Spinner size={20} />
              ) : (
                `Pay ${formatCurrency(total)}`
              )}
            </Button>
            {checkoutMutation.isError && (
              <p className="mt-2 text-center text-sm text-red-400">Payment failed. Please try again.</p>
            )}
          </div>
        </aside>
      </form>
    </div>
  )
}