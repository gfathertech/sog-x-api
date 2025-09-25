import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="glass-card-white p-8 rounded-2xl">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-8xl font-bold gradient-primary bg-clip-text text-transparent animate-bounce-subtle">
              404
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Content */}
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">
            Oops! Page not found
          </h1>
          <p className="text-secondary-600 mb-8 leading-relaxed">
            The page you're looking for seems to have wandered off. Noooo actually, it is still under development.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="btn-primary flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </div>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="mt-6 text-secondary-500 hover:text-primary-600 transition-colors duration-200 flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Go back to previous page
          </button>
        </div>

        {/* Popular Links */}
        <div className="mt-8 glass-card p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Popular Sections
          </h2>
          <div className="grid grid-cols-2 gap-3 font-bold">
            {[
              { name: 'Downloder', href: '/downloader' },
              { name: 'Ai', href: '/ai' },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-secondary-600 hover:text-primary-600 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-white/50"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;