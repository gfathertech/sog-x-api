import { useForm } from 'react-hook-form';
import { Eye, EyeOff, GhostIcon, Loader2, LucideGithub } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authContext';
import './auth.css'
import api from '../services/service';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
 const [isLoading, setisLoading] = useState(false);
 const { setUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });


  const onSubmit = async (data: LoginFormData) => {

    setisLoading(true);
    try {
      const res = await api.post('/api/auth/login', data);
      setMessage('🎉 Registration successful!');
      setUser(res.data)
      navigate('/dashboard')
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setisLoading(false);
    }
  };


  return (
    <div className="card grid h-screen ">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 10, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="w-full max-w-md bg-slate-200 rounded-2xl shadow-lg p-9 space-y-6"
      >
        <img src='/favicon.png' width={100} alt="Logo" />
        <h1 className="">Welcome Back 👋</h1>
        
        <div className="space-y-2">
          <div>
            <label className="">Email: </label>
            <motion.input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="input focus:ring-2 focus:ring-indigo-400 transition"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <label className="">Password: </label>
            <motion.input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="input focus:ring-2 focus:ring-indigo-400 pr-10 transition"
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
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Login'}
        </button>
        
        {message && <p className="text-center text-sm text-red-600">{message}</p>}
        
        <div className="mt-4 p-4 border border-gray-200 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
           <div className=" flex space-x-1 items-center">
         <div
          // type="submit"
          // disabled={loading}
          className="button"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 
          <GhostIcon/>}
        </div>
         <div
          // type="submit"
          // disabled={loading}
          className="button"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> :
           <LucideGithub/> }
        </div>
        </div>
      </motion.form>
    </div>
  );
}


