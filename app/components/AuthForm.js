'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const uzLabels = {
    loginTitle: 'Tizimga kirish',
    registerTitle: "Ro'yxatdan o'tish",
    email: 'Elektron pochta',
    password: 'Parol',
    confirmPassword: 'Parolni tasdiqlang',
    name: 'To\'liq ismingiz',
    remember: "Meni eslab qol",
    show: "Ko'rsatish",
    hide: "Yashirish",
    signIn: 'Kirish',
    signUp: "Ro'yxatdan o'tish",
    processing: 'Yuklanmoqda...',
    error: "Autentifikatsiya amalga oshmadi. Qaytadan urinib ko'ring.",
    noAccount: "Hisobingiz yo'qmi?",
    haveAccount: "Hisobingiz bormi?",
    register: "Ro'yxatdan o'tish",
    login: "Kirish"
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFirebaseError = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return "Bu email allaqachon ro'yxatdan o'tgan";
      case 'auth/invalid-email':
        return "Noto'g'ri email format";
      case 'auth/operation-not-allowed':
        return "Operatsiya amalga oshirilmadi";
      case 'auth/weak-password':
        return "Parol juda oddiy";
      case 'auth/user-not-found':
        return "Foydalanuvchi topilmadi";
      case 'auth/wrong-password':
        return "Noto'g'ri parol";
      default:
        return "Xatolik yuz berdi. Qaytadan urinib ko'ring";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!isLogin) {
        // Registration
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Parollar bir xil emas");
        }
        const { user } = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        await updateProfile(user, { displayName: formData.name });
        router.push('/admin');
      } else {
        // Login
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        router.push('/admin');
      }
    } catch (err) {
      setError(err.code ? handleFirebaseError(err) : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
      remember: false
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isLogin ? uzLabels.loginTitle : uzLabels.registerTitle}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded">
            {uzLabels.error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
                {uzLabels.name}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all text-gray-900 bg-transparent"
                required={!isLogin}
                disabled={isLoading}
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
              {uzLabels.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all text-gray-900 bg-transparent"
              required
              disabled={isLoading}
              placeholder="example@mail.com"
            />
          </div>
          
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
              {uzLabels.password}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all text-gray-900 bg-transparent"
              required
              disabled={isLoading}
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-600 hover:text-gray-900 text-sm"
            >
              {showPassword ? uzLabels.hide : uzLabels.show}
            </button>
          </div>
          
          {!isLogin && (
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-1">
                {uzLabels.confirmPassword}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all text-gray-900 bg-transparent"
                required={!isLogin}
                disabled={isLoading}
                placeholder="********"
              />
            </div>
          )}
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 rounded focus:ring-black text-black"
              disabled={isLoading}
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
              {uzLabels.remember}
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {uzLabels.processing}
              </span>
            ) : (
              isLogin ? uzLabels.signIn : uzLabels.signUp
            )}
          </button>

          <div className="mt-1 text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? uzLabels.noAccount : uzLabels.haveAccount}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="ml-1 text-black hover:underline font-medium focus:outline-none"
            >
              {isLogin ? uzLabels.register : uzLabels.login}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}