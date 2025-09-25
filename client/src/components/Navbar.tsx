import { Users } from 'lucide-react';
import { useNavigate} from 'react-router-dom';


function Navbar() {
const navigate = useNavigate()

  return (
    <header className=" bg-white/40 backdrop-blur-lg border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
             <img className='flex rounded-full w-16 sm:w-20 md:w-24 lg:w-28'
              src="/logo.jpg" 
              alt="logo"
              />
            <span className="text-xl font-semibold">APIs</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-300">Profile</span>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <Users
             className="w-4 h-4" 
             onClick={() => navigate("/profile")}
             />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;