import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Gamepad2, User as UserIcon, LogOut, Menu as MenuIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Button } from '../ui/Button';
import { Search } from './Search';
import { CartPreview } from './CartPreview';
import { MobileNav } from './MobileNav';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold leading-6 hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-text'}`;

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page on logout
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-sm">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3" aria-label="Main navigation">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary" aria-label="GameStore Home">
            <Gamepad2 size={24} />
            <span className="hidden sm:inline">GameStore</span>
          </Link>
          <div className="hidden lg:flex lg:gap-x-6">
            <NavLink to="/browse" className={navLinkClass}>
              Browse Games
            </NavLink>
            <NavLink to="/deals" className={navLinkClass}>
              Deals
            </NavLink>
            <NavLink to="/free" className={navLinkClass}>
              Free to Play
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Search />
          </div>

          <CartPreview />
          
          {isAuthenticated && user ? (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center gap-2 rounded-full bg-white/10 p-2 text-sm font-medium text-text hover:bg-white/20">
                <UserIcon size={20} />
                <span className="hidden md:inline">Hi, {user.name.split(' ')[0]}</span>
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
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button className={`${active ? 'bg-primary text-white' : 'text-text'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                          My Account
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={handleLogout} className={`${active ? 'bg-primary text-white' : 'text-text'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                          <LogOut className="mr-2 h-5 w-5" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <div className="hidden lg:flex">
                <Link to="/login">
                    <Button variant="outline">Login</Button>
                </Link>
            </div>
          )}

          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>
      <MobileNav isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
    </header>
  );
}

