// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h2 className="text-xl font-bold text-indigo-600">FitStream</h2>
              <p className="mt-2 text-sm text-gray-500">
                Join live fitness sessions from anywhere, anytime.
              </p>
            </div>

            <div className="md:ml-16">
              <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">
                Site Links
              </h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-gray-700">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/sessions" className="text-gray-500 hover:text-gray-700">
                    Sessions
                  </Link>
                </li>
                <li>
                  <Link to="/packages" className="text-gray-500 hover:text-gray-700">
                    Packages
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-700">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-700">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-700">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-700">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-500 hover:text-gray-700">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 md:mt-0">
            <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-6">
              {/* Social icons would go here */}
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                {/* Facebook icon */}
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                {/* Instagram icon */}
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                {/* Twitter icon */}
              </a>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 tracking-wider uppercase mb-2">
                Subscribe to our newsletter
              </h3>
              <form className="mt-2 sm:flex">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-5 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs"
                  placeholder="Enter your email"
                />
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="text-sm text-gray-500">
            &copy; {currentYear} FitStream. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
