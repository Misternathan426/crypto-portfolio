"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-white flex items-center">
                                <span className="text-2xl mr-2">₿</span>
                                Crypto Portfolio
                            </h1>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a 
                                href="#dashboard" 
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Dashboard
                            </a>
                            <a 
                                href="#portfolio" 
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Portfolio
                            </a>
                            <a 
                                href="#analytics" 
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Analytics
                            </a>
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {session ? (
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-3 px-3 py-2 bg-neutral-800 rounded-lg">
                                        {session.user?.image && (
                                            <img
                                                className="h-8 w-8 rounded-full border-2 border-green-400"
                                                src={session.user.image}
                                                alt={session.user.name || 'User'}
                                            />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-medium">
                                                {session.user?.name || 'User'}
                                            </span>
                                            <span className="text-green-400 text-xs">
                                                ● Online
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => signIn("google", { callbackUrl: '/' })}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Sign In with Google
                                    </button>
                                    <button
                                        onClick={() => signIn("github", { callbackUrl: '/' })}
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Sign In with GitHub
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-400 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-neutral-800">
                        <a
                            href="#dashboard"
                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        >
                            Dashboard
                        </a>
                        <a
                            href="#portfolio"
                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        >
                            Portfolio
                        </a>
                        <a
                            href="#analytics"
                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        >
                            Analytics
                        </a>
                        
                        <div className="border-t border-gray-700 pt-4">
                            {session ? (
                                <div className="space-y-3">
                                    <div className="flex items-center px-3 py-3 bg-neutral-700 rounded-lg">
                                        {session.user?.image && (
                                            <img
                                                className="h-10 w-10 rounded-full border-2 border-green-400 mr-3"
                                                src={session.user.image}
                                                alt={session.user.name || 'User'}
                                            />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-medium">
                                                {session.user?.name || 'User'}
                                            </span>
                                            <span className="text-green-400 text-xs">
                                                ● Online
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-base font-medium transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => signIn("google", { callbackUrl: '/' })}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-base font-medium transition-colors"
                                    >
                                        Sign In with Google
                                    </button>
                                    <button
                                        onClick={() => signIn("github", { callbackUrl: '/' })}
                                        className="w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-base font-medium transition-colors"
                                    >
                                        Sign In with GitHub
                                    </button>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400 mt-2">
                                            New to Crypto Portfolio? Signing in will create your account automatically.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}