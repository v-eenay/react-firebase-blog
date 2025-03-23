import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';



const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Categories', href: '/categories' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  return (
    <>
      <Disclosure as="nav" className="bg-[var(--color-paper)] border-b-2 border-[var(--color-ink)] shadow-md">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="text-2xl font-bold font-serif text-[var(--color-ink)]">
                      The Daily Blog
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          location.pathname === item.href
                            ? 'border-[var(--color-ink)] text-[var(--color-ink)]'
                            : 'border-transparent text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]',
                          'inline-flex items-center border-b-2 px-3 pt-1 text-sm font-serif font-medium transition-colors duration-200'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                  {user ? (
                    <button
                      onClick={() => logout()}
                      className="btn-retro"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link to="/login" className="btn-retro bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 rounded-none font-serif hover:opacity-90">
                        Login
                      </Link>
                      <Link to="/signup" className="btn-retro bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 rounded-none font-serif hover:opacity-90">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-[var(--color-accent)] hover:bg-[var(--color-paper)]/80 hover:text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-ink)]">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
  
            <Disclosure.Panel className="sm:hidden bg-[var(--color-paper)] border-t-2 border-[var(--color-ink)]">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      location.pathname === item.href
                        ? 'border-[var(--color-ink)] text-[var(--color-ink)] bg-[var(--color-paper)]/80'
                        : 'border-transparent text-[var(--color-accent)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper)]/50',
                      'block border-l-4 py-3 pl-4 pr-4 text-base font-serif font-medium transition-colors duration-200'
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                <div className="pt-4 pb-3 border-t border-[var(--color-ink)]/20">
                  {user ? (
                    <button
                      onClick={() => logout()}
                      className="block w-full text-left px-4 py-3 text-base font-serif font-medium text-[var(--color-accent)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper)]/50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setAuthMode('login');
                          setIsAuthModalOpen(true);
                        }}
                        className="block w-full text-left px-4 py-3 text-base font-serif font-medium bg-[var(--color-ink)] text-[var(--color-paper)] hover:opacity-90 transition-colors duration-200"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode('signup');
                          setIsAuthModalOpen(true);
                        }}
                        className="block w-full text-left px-4 py-3 text-base font-serif font-medium bg-[var(--color-ink)] text-[var(--color-paper)] hover:opacity-90 transition-colors duration-200"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      
    </>
  );
}