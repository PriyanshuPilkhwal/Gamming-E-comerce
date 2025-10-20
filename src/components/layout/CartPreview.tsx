import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { Menu, Transition } from '@headlessui/react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '../ui/Button';

export function CartPreview() {
  const { items, getTotalItems, getTotalPrice, removeFromCart } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className="relative rounded-full p-2 text-text transition-colors hover:bg-white/10 hover:text-primary"
        aria-label={`View shopping cart, ${totalItems} items`}
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
            {totalItems}
          </span>
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-text-muted">Your cart is empty.</div>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto">
                  {items.map(({ game, quantity }) => (
                    <Menu.Item key={game.id}>
                      <div className="flex items-center gap-3 p-2">
                        <img src={game.images[0]} alt={game.title} className="h-16 w-12 rounded object-cover" />
                        <div className="flex-grow">
                          <p className="truncate font-semibold text-text">{game.title}</p>
                          <p className="text-sm text-text-muted">
                            {quantity} x {formatCurrency(game.price)}
                          </p>
                        </div>
                        <button onClick={() => removeFromCart(game.id)} className="text-text-muted hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Menu.Item>
                  ))}
                </div>
                <div className="mt-2 border-t border-white/10 p-2">
                  <div className="flex justify-between font-semibold text-text">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <Button asChild className="mt-4 w-full">
                    <Link to="/cart">View Cart & Checkout</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
