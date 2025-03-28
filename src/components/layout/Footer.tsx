import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="retro-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="text-xl font-bold">
              Blog App
            </Link>
            <p className="text-sm">
              Share your thoughts and ideas with the world.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Navigation
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/" className="text-base hover:opacity-80">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="text-base hover:opacity-80">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/categories" className="text-base hover:opacity-80">
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-base hover:opacity-80">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Account
                </h3>
                <ul className="mt-4 space-y-4">
                  {!user ? (
                    <>
                      <li>
                        <Link to="/login" className="text-base hover:opacity-80">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link to="/signup" className="text-base hover:opacity-80">
                          Sign Up
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/dashboard" className="text-base hover:opacity-80">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to={`/profile/${user.uid}`} className="text-base hover:opacity-80">
                          Profile
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t-2 border-[var(--color-ink)] pt-8">
          <p className="text-base xl:text-center">
            &copy; {new Date().getFullYear()} Blog App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}