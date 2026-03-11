import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { Button } from '../ui/Button';

export const AuthOverlay = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onAuthSuccess();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay active" style={{ backgroundColor: 'var(--bg-color)' }}>
            <div className="modal" style={{ maxWidth: '400px' }}>
                <h2 className="mb-2 text-center" style={{ borderBottom: 'none' }}>
                    Designer Roadmap
                </h2>
                <p className="mb-4 text-center">
                    {isSignUp ? 'Create an account to save your journey.' : 'Welcome back, designer.'}
                </p>

                <form onSubmit={handleAuth}>
                    <label className="metric-label mb-1" style={{ display: 'block' }}>Email</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="mb-3"
                    />

                    <label className="metric-label mb-1" style={{ display: 'block' }}>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="mb-4"
                    />

                    {error && <div className="text-sm mb-3" style={{ color: 'var(--accent-color)' }}>{error}</div>}
                    {message && <div className="text-sm mb-3" style={{ color: 'var(--success-color)' }}>{message}</div>}

                    <Button variant="primary" className="mb-3 w-full" type="submit" disabled={loading}>
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </Button>

                    <p className="text-center text-sm">
                        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                        <button
                            type="button"
                            className="text-accent"
                            style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError(null);
                                setMessage(null);
                            }}
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};
