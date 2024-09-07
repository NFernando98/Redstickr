'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase'; // Ensure you have Firebase initialized in this file

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between sign-up and login
    const [error, setError] = useState('');
    const router = useRouter();
    const auth = getAuth(app);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created:', userCredential.user);

            // Sign the user in using NextAuth after sign-up
            await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            // Redirect to home page after successful sign-up
            router.push('/');
        } catch (error: any) {
            setError(error.message);
            console.error('Error during sign-up:', error);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Sign in with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User signed in:', userCredential.user);

            // Sign the user in using NextAuth
            await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            // Redirect to home page after successful sign-in
            router.push('/');
        } catch (error: any) {
            setError(error.message);
            console.error('Error during sign-in:', error);
        }
    };

    return (
        <div>
            <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>

            {/* Toggle between Sign-up and Sign-in */}
            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Go to Login' : 'Go to Sign Up'}
            </button>

            {/* Form for Sign-up or Login */}
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
            </form>

            {/* Sign in with Google */}
            <div>
                <button onClick={() => signIn('google')}>
                    {isSignUp ? 'Sign Up with Google' : 'Sign In with Google'}
                </button>
            </div>
        </div>
    );
}
