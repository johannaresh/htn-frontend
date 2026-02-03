import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">Hackathon Global Inc.</h3>
            <p className="text-gray-400 text-sm">Building the future, one hack at a time.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                About
              </Link>
              <Link to="/events" className="text-gray-400 hover:text-white text-sm transition-colors">
                Events
              </Link>
              <Link to="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">
                FAQ
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Connect</h3>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © {currentYear} Hackathon Global Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
