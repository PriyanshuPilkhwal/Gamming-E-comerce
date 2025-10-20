import { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { X, Gamepad2 } from 'lucide-react';

type MobileNavProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  const navLinkClass = `block rounded-md px-3 py-2 text-base font-medium text-text-muted hover:bg-white/10 hover:text-white`;
  const activeNavLinkClass = `bg-primary text-white`;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="flex-1 overflow-y-auto bg-background p-6">
                <div className="flex items-center justify-between">
                  <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <Gamepad2 size={28} />
                    <span>GameStore</span>
                  </Link>
                  <button type="button" className="-m-2.5 p-2.5" onClick={() => setIsOpen(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-white/10">
                    <div className="space-y-2 py-6">
                      <NavLink
                        to="/"
                        className={({ isActive }) => `${navLinkClass} ${isActive ? activeNavLinkClass : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        Home
                      </NavLink>
                      <NavLink
                        to="/browse"
                        className={({ isActive }) => `${navLinkClass} ${isActive ? activeNavLinkClass : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        Browse
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
