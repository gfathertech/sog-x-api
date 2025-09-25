import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { Eye, EyeOff, GhostIcon,              Loader2, LucideGithub } from 'lucide-react';
import { motion } from 'framer-motion';
import './auth.css'
import { useAuth } from '../context/authContext';
import api from '../services/service';


// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],});

type RegisterInput = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', data);
      setMessage('🎉 Registration successful!');
      setUser(res.data)
      navigate('/dashboard')
    } catch (err: any) {
      setMessage(err.response?.data?.message || '⚠️ Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card grid h-screen">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 10, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="w-full max-w-md bg-slate-200 rounded-2xl shadow-lg p-9 space-y-6">
          
            <img 
       src='/favicon.png'
       width={100}
       />
       
        <h1 className="">
          Create Your Account
        </h1>

        <div className="space-y-2">
          <div>
            <label className="">Name: </label>
            <motion.input
              {...register('name')}
              type="text"
              placeholder="Gfather Tech"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="">Email: </label>
            <motion.input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

            <div className='flex space-x-2'> 
              <div className="relative">
            <label className="">
              Password: </label>
            <motion.input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10 transition"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            
            <div
              className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-indigo-600 transition"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

            <div className="relative">
            <label className="">
              Confirm Password: </label>
            <motion.input
              {...register('confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10 transition"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            
            <div
              className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-indigo-600 transition"
              onClick={() => setShowPassword((v) => !v)}
            >
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
         



        </div>
            
             <div>
            <label className="">Role: </label>
            <motion.input
              {...register('role')}
              type="text"
              placeholder="user"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>
         <button
          type="submit"
          disabled={loading}
          className="button"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Register'}
        </button>

        {message && <p className="text-center text-sm text-red-700">{message}</p>}

        <div className="mt-4 p-4 border border-gray-200 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-indigo-600 font-medium hover:underline">
              Login
            </Link>
          </p> 
        </div>
       <div className="oauth-buttons flex space-x-1 items-center">
         <div
         
          className="button"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 
          <GhostIcon/>}
        </div>
         <div
          className="button"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> :
           <LucideGithub/> }
        </div>
        </div>
      </motion.form>
    </div>
);
}
