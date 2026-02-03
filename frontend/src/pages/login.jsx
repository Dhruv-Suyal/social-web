import API from "../api";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
        // Clear success message
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const response = await API.post("/login", formData);
            setSuccessMessage('Login successful! Redirecting...');
            // Store token if provided
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            // Redirect to home after a short delay
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            setErrors({ 
                submit: error.response?.data?.message || 'Login failed. Please try again.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="form-wrapper">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h2 className="login-title">Welcome Back</h2>
                        <p className="form-subtitle">Sign in to your account</p>
                    </div>

                    {errors.submit && <div className="alert alert-error"><span className="alert-icon">✕</span>{errors.submit}</div>}
                    {successMessage && <div className="alert alert-success"><span className="alert-icon">✓</span>{successMessage}</div>}

                <div className="input-group">
                    <label className="label" htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`input ${errors.email ? 'input-error' : ''}`}
                        placeholder="you@example.com"
                        disabled={loading}
                    />
                    {errors.email && <span className="error-text"><span className="error-icon">!</span>{errors.email}</span>}
                </div>

                <div className="input-group">
                    <label className="label" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`input ${errors.password ? 'input-error' : ''}`}
                        placeholder="••••••••"
                        disabled={loading}
                    />
                    {errors.password && <span className="error-text"><span className="error-icon">!</span>{errors.password}</span>}
                </div>

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="login-footer">
                    Don't have an account? <a href="/signup">Sign up here</a>
                </div>
                </form>
            </div>
        </div>
    );
}
