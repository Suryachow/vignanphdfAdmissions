import { useState } from 'react'
import { adminApiUrl } from './lib/api'

interface LoginProps {
    onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(adminApiUrl('/api/admin/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('admin_token', data.access_token);
                onLogin();
            } else {
                setError(data.detail || 'Invalid credentials');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em' }}>VIGNAN</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>ADMIN PORTAL</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Work Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@vignan.ac.in"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'var(--error)', marginBottom: '1.5rem', fontSize: '0.75rem', textAlign: 'center', fontWeight: 500 }}>{error}</p>}
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Strictly for authorized personnel only.
                </div>
            </div>
        </div>
    );
};

export default Login;
