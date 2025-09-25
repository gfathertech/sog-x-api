import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { pages } from '../services/config';
import { ChevronLeft, ChevronRight } from 'lucide-react';


function Sidebar() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const currentPath = window.location.pathname

  return (
        <aside className={`${isNavbarOpen ? 'w-64' : 'w-16'} bg-white/40 backdrop-blur-lg border border-white/20 shadow-2xl min-h-screen transition-all duration-300 ease-in-out sticky top-0`}>
          {/* Toggle Button */}
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={() => setIsNavbarOpen(!isNavbarOpen)}
              className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={isNavbarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isNavbarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">

{pages.map((item) => {
  const IconComponent = item.icon;
  const colorClass = `text-${item.color}-400`;

  return (
    <li key={item.name}>
      {/* Use NavLink for internal routing and active state management */}
      <NavLink
        to={item.id} 
        className={`flex space-x-3 items-center w-full px-3 py-2 rounded-lg 
          transition-colors ${currentPath === item.id ? 'bg-blue-600 text-yellow-50'
            : 'text-gray-300 hover:bg-gray-600'
            }`}
        
        
        aria-label={item.name}
      >
        <div className="relative group">
          <IconComponent className={`w-5 h-5 ${colorClass} flex-shrink-0`} />
          {/* Tooltip for when the navbar is collapsed */}
          {!isNavbarOpen && (
            <span className="absolute left-full ml-4 px-2 py-1 text-sm rounded-md bg-gray-900 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none min-w-max">
              {item.name}
            </span>
          )}
        </div>
        {/* Visible text when the navbar is open */}
        {isNavbarOpen && (
          <span className="truncate">{item.name}</span>
        )}
      </NavLink>
    </li>
  );
})}
            </ul>
          </nav>
        </aside>
  );
}

export default Sidebar;