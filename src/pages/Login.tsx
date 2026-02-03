import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/events';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(username, password);

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials. Try username: hacker, password: htn2026');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            {error && (
              <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded p-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            <Button type="submit" variant="primary" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-6 p-4 bg-gray-800 rounded text-sm text-gray-400">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Username: hacker</p>
            <p>Password: htn2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};
