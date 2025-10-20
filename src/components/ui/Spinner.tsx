import { Loader2 } from 'lucide-react'

export function Spinner({ size = 24 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-primary" />
}

export function PageSpinner() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <Spinner size={48} />
    </div>
  )
}