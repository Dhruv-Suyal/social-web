import API from "../api";
import { useState } from 'react';
import './signUp.css';
import { useNavigate } from "react-router-dom";


export function SignUp() {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (errors.server) {
            setErrors(prev => ({ ...prev, server: "" }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.userName.trim()) newErrors.userName = 'Username is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try{
        const response = await API.post("/register", {
            userName:formData.userName,
            email:formData.email,
            password:formData.password
        });
        if(response.data.success){
            navigate('/login');
        }
        }catch(err){
            setErrors(prev=>({...prev, server:err.response?.data?.message || "something went wrong"}));
        }
    };

    return (
        <div className="signup-container">
            <div className="form-wrapper">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h2 className="signup-title">Create Account</h2>
                        <p className="form-subtitle">Join us today</p>
                    </div>
                    
                    {errors.server && <div className="alert alert-error"><span className="alert-icon">✕</span>{errors.server}</div>}

                <div className="input-group">
                    <label className="label" htmlFor="userName">Username</label>
                    <input
                        type="text"
                        id="userName"
                        required
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className={`input ${errors.userName ? 'input-error' : ''}`}
                        placeholder="Choose a username"
                    />
                    {errors.userName && <span className="error-text"><span className="error-icon">!</span>{errors.userName}</span>}
                </div>

                <div className="input-group">
                    <label className="label" htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`input ${errors.email ? 'input-error' : ''}`}
                        placeholder="you@example.com"
                    />
                    {errors.email && <span className="error-text"><span className="error-icon">!</span>{errors.email}</span>}
                </div>

                <div className="input-group">
                    <label className="label" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`input ${errors.password ? 'input-error' : ''}`}
                        placeholder="Minimum 6 characters"
                    />
                    {errors.password && <span className="error-text"><span className="error-icon">!</span>{errors.password}</span>}
                </div>

                <div className="input-group">
                    <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                        placeholder="Re-enter your password"
                    />
                    {errors.confirmPassword && <span className="error-text"><span className="error-icon">!</span>{errors.confirmPassword}</span>}
                </div>

                <button type="submit" className="signup-button">Sign Up</button>
                
                <div className="signup-footer">
                    Already have an account? <a href="/login">Login here</a>
                </div>
                </form>
            </div>
        </div>
    );
}