'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config';

export default function AdminPanel() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <button
        onClick={() => auth.signOut()}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        Chiqish
      </button>
    </div>
  );
}
