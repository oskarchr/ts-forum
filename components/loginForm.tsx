'use client'
import { useState } from 'react';
import { useAuth } from '@/utils/authContext';
import { useRouter } from "next/navigation";
import { registeredUsers } from '@/utils/auth';

const LoginForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    const errorMessage = login(userName, password);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setError(null);
      router.push('/')
    }
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="absolute left-0 text-white">
        <pre>{JSON.stringify(registeredUsers, null, 2)}</pre>
      </div>
      <div className="h-full max-w-md bg-white rounded-lg shadow-md p-6 mt-24 text-black">
          <div>
            <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border rounded p-2 mt-4 text-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2 mt-4 text-black"
            />
            <button
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mt-4 rounded transition"
              onClick={handleLogin}
            >
              Login
            </button>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
      </div>
    </div>
  );
};

export default LoginForm;