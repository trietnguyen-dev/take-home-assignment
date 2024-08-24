"use client";

import React, { useState } from 'react';
import { signIn, signInWithAdmin } from './api/auth';
import { useRouter } from 'next/navigation';
import IResponse from './interface/IResponse';

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userType, setUserType] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response: IResponse = userType === 'admin'
        ? await signInWithAdmin(email, password)
        : await signIn(email, password);
      if (response.err) {
        setErrorMessage(response.msg || 'An error occurred during sign-in.');
        return;
      }
      localStorage.setItem('authToken', response.token || '');
      router.push(userType === 'admin' ? '/dashboard' : '/listing');
    } catch (error) {
      setErrorMessage('An error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign In
            </h1>
            <div className="flex justify-around mb-6">
              <button
                className={`py-2 px-4 rounded ${userType === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setUserType('user')}
              >
                User Login
              </button>
              <button
                className={`py-2 px-4 rounded ${userType === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setUserType('admin')}
              >
                Admin Login
              </button>
            </div>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter Your Email"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                If you don't have an account, please{' '}
                <a href="/sign-up" className="text-blue-600 hover:underline">Sign Up</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
