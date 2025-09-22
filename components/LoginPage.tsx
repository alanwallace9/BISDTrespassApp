import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_USER_CREDENTIALS } from '../constants';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetView, setIsResetView] = useState(false);
  const { login, resetPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await login(email, password);
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleTestLogin = async (role: UserRole) => {
    setLoading(true);
    setError('');
    setMessage('');
    const credentials = MOCK_USER_CREDENTIALS[role];
    if (credentials) {
      const { error } = await login(credentials.email, credentials.password);
      if (error) {
        setError(`Test login failed. Ensure test user '${credentials.email}' is set up in Supabase.`);
      }
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await resetPassword(email);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset link sent to your email.');
      setIsResetView(false);
    }
    setLoading(false);
  };
  
  const testUsers: {role: UserRole, label: string}[] = [
      {role: UserRole.MASTER_ADMIN, label: "Master Admin"},
      {role: UserRole.DISTRICT_ADMIN, label: "District Admin"},
      {role: UserRole.CAMPUS_ADMIN, label: "Campus Admin"},
      {role: UserRole.VIEWER, label: "Viewer"},
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            BISD Trespass Management
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isResetView ? 'Reset your password' : 'Please sign in to your account'}
          </p>
        </div>

        {isResetView ? (
            <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
                 <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                    />
                </div>
                 {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                {message && <p className="text-green-400 text-xs text-center">{message}</p>}
                <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:bg-blue-800 disabled:cursor-not-allowed">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <div className="text-sm text-center">
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsResetView(false); setError(''); setMessage('');}} className="font-medium text-blue-400 hover:text-blue-300">
                        Back to Sign In
                    </a>
                </div>
            </form>
        ) : (
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-none rounded-t-md relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <div className="text-sm">
                        <a href="#" onClick={(e) => { e.preventDefault(); setIsResetView(true); setError(''); setMessage(''); }} className="font-medium text-blue-400 hover:text-blue-300">
                            Forgot your password?
                        </a>
                    </div>
                </div>
                
                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                {message && <p className="text-green-400 text-xs text-center">{message}</p>}

                <div>
                    <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:bg-blue-800 disabled:cursor-not-allowed">
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>
        )}
        
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-500">
                    Or login with a test user
                </span>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
            {testUsers.map(({role, label}) => (
                <button key={role} onClick={() => handleTestLogin(role)} disabled={loading} className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                    {label}
                </button>
            ))}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;