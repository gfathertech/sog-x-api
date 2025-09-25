import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import api from '../services/service';
import { LogOut, Edit3, ArrowLeft } from "lucide-react";

const Profile = () => {
  // const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser, logout } = useAuth();
  const [fresh, setFresh] = useState<any>(null);
  fresh;

  // Optionally re-fetch to ensure you have the latest full user object
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get("/api/auth/me"); // withCredentials is set in api.ts
        if (!cancelled) {
          setFresh(res.data);
          setUser(res.data); // keep context in sync with server
        }
      } catch (err) {
        if (!cancelled) setFresh(null);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [setUser]);


  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const updates = Object.fromEntries(formData);
      const res = await api.put("/api/auth/me", updates);
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors: Record<string, string> = {
    free: "bg-gray-300 text-gray-800",
    gold: "bg-yellow-400 text-yellow-900",
    diamond: "bg-blue-500 text-white",
  };

  // if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>No user foundyyy</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
       {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="btn-glass text-secondary-500 hover:text-primary-600 transition-colors duration-200  items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
           <div className="flex mt-4 items-center space-x-6">
        {/* Avatar */} 
           <img
          src={`https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
          alt="avatar"
          className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-md"
        />       

        {/* User Info */}
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <span
            className={`inline-block px-3 py-1 mt-2 text-sm font-medium rounded-full ${statusColors[user?.status]}`}
          >
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)} Member
          </span>
        </div>
      </div>

      {/* API Key */}
      <div className="mt-6 space-y-3">
        <label className="block text-gray-500 text-sm">API Key</label>
        <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
          <code className="text-sm">{user.apikey}</code>
          <button
            onClick={() => navigator.clipboard.writeText(user.apikey)}
            className="text-blue-500 hover:underline text-sm"
          >Copy</button>          
        </div>

            
      </div>

      


      {/* Edit Form */}
      {isEditing ? (
        <form onSubmit={handleUpdate} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-600">GEMINI_APIKEY(Edit and save)</label>
            <input
              name="GEMINI_APIKEY"
              defaultValue='GEMINI API KEY'
              className="w-full p-1 border rounded-md"
            />
            <label className="block text-sm text-gray-600">Name</label>
            <input
              name="name"
              defaultValue={user.name}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              name="email"
              defaultValue={user.email}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="ml-3 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="mt-6 flex space-x-3">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
          </button>
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
