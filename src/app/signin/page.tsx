"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <p className="text-center text-gray-400 mb-6">
          Sign in to access your crypto portfolio
        </p>
        
        {providers && Object.values(providers).length > 0 ? (
          Object.values(providers).map((provider: any) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mb-3"
            >
              Sign in with {provider.name}
            </button>
          ))
        ) : (
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              No authentication providers configured.
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Continue without signing in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}