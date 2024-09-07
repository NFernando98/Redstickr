'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Signin() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/'); // Redirect to home page if authenticated
        }
    }, [status, router]);

    // Handle Google Sign-In using NextAuth
    const handleGoogleSignIn = async () => {
        setLoading(true);
        const result = await signIn('google', { callbackUrl: '/' });
        setLoading(false);

        if (result?.error) {
            console.error("Google sign-in error:", result.error);
            alert('Failed to sign in with Google. Please try again.');
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
                    <span className="text-4xl font-bold text-black-600">Red</span>
                    <span className="text-4xl font-bold text-red-600">Sticker</span>
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <div>
                        <button
                            onClick={handleGoogleSignIn}
                            className="flex w-full justify-center items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                        >
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
