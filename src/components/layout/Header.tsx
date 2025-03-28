import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import NotificationBell from '../NotificationBell';
import ThemeToggle from '../ThemeToggle';
import LanguageSelector from '../LanguageSelector';
import { useTranslation } from 'react-i18next';

const navigation = [
  { name: 'nav.home', href: '/' },
  { name: 'nav.blog', href: '/blog' },
  { name: 'nav.categories', href: '/categories' },
  { name: 'nav.about', href: '/about' },
  { name: 'nav.terms', href: '/terms' }
];

const adminNavigation = [
  { name: 'nav.adminDashboard', href: '/admin' }
];

const userLinks = [
  { name: 'nav.myDashboard', href: '/dashboard' },
  { name: 'nav.profile', href: '/profile' }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
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
                        {t(item.name)}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                  <LanguageSelector />
                  <ThemeToggle />
                  {user ? (
                    <>
                      <NotificationBell />
                      <div className="flex items-center space-x-4">
                        {(user.role === 'admin' ? adminNavigation : userLinks).map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="btn-retro bg-[var(--color-ink)] text-[var(--color-paper)]"
                          >
                            {t(item.name)}
                          </Link>
                        ))}
                        <button onClick={() => logout()} className="btn-retro">{t('nav.logout')}</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="btn-retro bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 rounded-none font-serif hover:opacity-90">{t('auth.login')}</Link>
                      <Link to="/signup" className="btn-retro bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 rounded-none font-serif hover:opacity-90">{t('auth.register')}</Link>
                    </>
                  )}
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-[var(--color-accent)] hover:bg-[var(--color-paper)]/80 hover:text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-ink)]">
                    <span className="sr-only">{t('common.openMenu')}</span>
                    {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
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
                        ? 'bg-[var(--color-paper)]/80 text-[var(--color-ink)]'
                        : 'text-[var(--color-accent)] hover:bg-[var(--color-paper)]/80 hover:text-[var(--color-ink)]',
                      'block px-3 py-2 text-base font-serif font-medium'
                    )}
                  >
                    {t(item.name)}
                  </Disclosure.Button>
                ))}
                <div className="px-3 py-2">
                  <LanguageSelector />
                </div>
                <div className="px-3 py-2">
                  <ThemeToggle />
                </div>
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <NotificationBell />
                    </div>
                    {(user.role === 'admin' ? adminNavigation : userLinks).map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as={Link}
                        to={item.href}
                        className="block px-3 py-2 text-base font-serif font-medium text-[var(--color-accent)] hover:bg-[var(--color-paper)]/80 hover:text-[var(--color-ink)]"
                      >
                        {t(item.name)}
                      </Disclosure.Button>
                    ))}
                    <Disclosure.Button
                      onClick={() => logout()}
                      className="block w-full text-left px-3 py-2 text-base font-serif font-medium text-[var(--color-accent)] hover:bg-[var(--color-paper)]/80 hover:text-[var(--color-ink)]"
                    >
                      {t('nav.logout')}
                    </Disclosure.Button>
                  </>
                ) : (
                  <>
                    <Disclosure.Button
                      as={Link}
                      to="/login"
                      className="block px-3 py-2 text-base font-serif font-medium text-[var(--color-accent)] hover:bg-[var(--color-paper)]/80 hover:text-[var(--color-ink)]"
                    >
                      {t('auth.login')}
                    </Disclosure.Button>
                    <Disclosure.Button
                      as={Link}
                      to="/signup"
                      className="block px-3 py-2 text-base font-serif font-medium text-[var(--color-accent)] hover:bg-[var(--color-paper)]/80 hover:text-[var(--color-ink)]"
                    >
                      {t('auth.register')}
                    </Disclosure.Button>
                  </>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}