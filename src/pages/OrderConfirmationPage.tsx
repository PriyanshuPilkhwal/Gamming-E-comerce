import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'

export function OrderConfirmationPage() {
  const location = useLocation()
  const { orderId, total } = location.state || { orderId: 'MOCK-12345', total: 0 }

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-white/10 bg-card p-8 py-12 text-center">
      <CheckCircle size={80} className="mx-auto text-green-500" />
      <h1 className="mt-6 text-4xl font-bold text-primary">Thank You!</h1>
      <p className="mt-4 text-xl">Your order has been placed successfully.</p>
      
      <div className="mt-8 space-y-2 text-lg">
        <p>
          <span className="text-text-muted">Order ID:</span>
          <strong className="ml-2 font-mono">{orderId}</strong>
        </p>
        <p>
          <span className="text-text-muted">Total Paid:</span>
          <strong className="ml-2">{formatCurrency(total)}</strong>
        </p>
      </div>

      <p className="mt-6 text-text-muted">A confirmation email has been (mock) sent to you.</p>

      <Button asChild size="lg" className="mt-10">
        <Link to="/browse">Continue Shopping</Link>
      </Button>
    </div>
  )
}