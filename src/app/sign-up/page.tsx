'use client';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth } from '../../firebase'; // Make sure this import is correct

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const signup = async () => {
        setError(null);
        setSuccess(null);

        if (password !== passwordAgain) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created successfully:', userCredential.user);
            setSuccess('Sign up successful! Redirecting...');
            setTimeout(() => {
                router.push('/sign-in'); // Redirect to login or another page after successful sign-up
            }, 2000);
        } catch (error: unknown) {
            // Log the error to the console to understand what is going wrong
            console.error('Sign up error:', error);

            // Handle Firebase errors specifically
            if (error instanceof Error) {
                setError(error.message || 'An unknown error occurred during sign up.');
            } else {
                setError('An unknown error occurred during sign up.');
            }
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
                        Sign up
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-black">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-black">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="passwordAgain" className="block text-sm font-medium leading-6 text-black">
                                    Password Again
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="passwordAgain"
                                    name="passwordAgain"
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={(e) => setPasswordAgain(e.target.value)}
                                    required
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                disabled={!email || !password || !passwordAgain || password !== passwordAgain}
                                onClick={() => signup()}
                                className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Sign Up
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 text-center text-red-500">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mt-4 text-center text-green-500">
                                {success}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
