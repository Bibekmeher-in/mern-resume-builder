import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { authStyles as styles, inputStyles } from '../assets/dummystyle';
import { validateEmail } from '../utils/helper';
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from '../utils/apiPaths';

const Login = ({ setCurrentPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [focusedField, setFocusedField] = useState(null); // State to track focus

    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Please enter a valid Email address');
            return;
        }

        if (!password) {
            setError('Please enter your password!');
            return;
        }

        setError('');

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
            const { token } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                updateUser(response.data);
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerWrapper}>
                <h3 className={styles.title}>Welcome Back</h3>
                <p className={styles.subtitle}>Sign in to continue building amazing resumes</p>
            </div>

            {/* FORM */}
            <form onSubmit={handleLogin} className={styles.form}>

                {/* Email Field with Full Styling */}
                <div className={inputStyles.wrapper}>
                    {/* The label can be added here if needed, but for now, we focus on the input structure */}
                    <div className={inputStyles.inputContainer(focusedField === 'email')}>
                        <input
                            className={inputStyles.inputField}
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            onFocus={() => setFocusedField('email')}                 
                            onBlur={() => setFocusedField(null)}     
                            placeholder="example@gmail.com"
                            type="email"
                        />
                    </div>
                </div>

                {/* Password Field with Full Styling */}
                <div className={inputStyles.wrapper}>
                    <div className={inputStyles.inputContainer(focusedField === 'password')}>
                        <input
                            className={inputStyles.inputField}
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                            onFocus={() => setFocusedField('password')} 
                            onBlur={() => setFocusedField(null)}     
                            placeholder="Min 8 characters"
                            type="password"
                        />
                    </div>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <button type="submit" className={styles.submitButton}>
                    Sign In
                </button>

                {/* FOOTER */}
                <p className={styles.switchText}>
                    Don’t have an account?{' '}
                    <button
                        onClick={() => setCurrentPage('signup')}
                        type="button"
                        className={styles.switchButton}
                    >
                        Sign Up
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;