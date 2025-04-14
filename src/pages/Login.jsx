import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://store-rating-backend-mkns.onrender.com/api/auth/login', {
                email,
                password
            });

            const { token, user } = response.data;

            // Store token and role in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);

            // Set token in axios headers globally
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            console.log('Login Successful:', { token, user });

            // Redirect based on role
            if (user.role === 'admin' && window.location.pathname !== '/dashboard') {
                navigate('/dashboard');
            } else if (user.role === 'user' && window.location.pathname !== '/stores') {
                navigate('/stores');
            } else if (user.role === 'store-owner' && window.location.pathname !== '/store-owner') {
                navigate('/store-owner'); // Handle store-owner role
            } else {
                alert('Invalid user role');
            }
        } catch (error) {
            console.error('Login failed:', error);

            const message = error.response?.data?.message || 'Invalid credentials. Please try again.';
            alert(message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-3 px-3 py-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 px-3 py-2 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    Login
                </button>
                <p className="mt-4 text-center">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
