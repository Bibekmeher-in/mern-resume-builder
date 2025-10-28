import React, { useContext, useState } from 'react'
import { authStyles as styles, inputStyles } from '../assets/dummystyle'
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper'
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { Target } from 'lucide-react';

const SignUp = ({ setCurrentPage }) => {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!fullName) {
            setError('Please enter FullName')
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid Email address")
            return;
        }
        if (!password) {
            setError("Please enter password !")
            return;
        }
        setError('');

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                name: fullName,
                email,
                password,

            })
            console.log(response)
            const { token } = response.data;
            if (token) {
                localStorage.setItem('token', token);
                updateUser(response.data);
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong. Please try again.')
        }
    }

    const inputStyleClasses = `${inputStyles.inputField} border-none bg-white text-gray-900 placeholder-gray-400`;

    return (
        <div className={styles.signupContainer}>
            <div className={styles.headerWrapper}>
                <h3 className={styles.signupTitle}>Create Account</h3>
                <p className={styles.signupSubtitle}>Join thousands of professional today</p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSignUp} className={styles.signupForm}>

                {/* Full Name Field */}
                <div className={inputStyles.wrapper}>
                    <label className={inputStyles.label}>Full Name</label>
                    <div className={inputStyles.inputContainer(focusedField === 'fullName')}>
                        <input
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                            onFocus={() => setFocusedField('fullName')}
                            onBlur={() => setFocusedField(null)}
                            className={inputStyleClasses} 
                            placeholder='John Doe'
                            type="text"
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className={inputStyles.wrapper}>
                    <label className={inputStyles.label}>Email Address</label>
                    <div className={inputStyles.inputContainer(focusedField === 'email')}>
                        <input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className={inputStyleClasses} 
                            placeholder='email@example.com'
                            type="email"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className={inputStyles.wrapper}>
                    <label className={inputStyles.label}>Password</label>
                    <div className={inputStyles.inputContainer(focusedField === 'password')}>
                        <input
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            className={inputStyleClasses} 
                            placeholder='Min 8 characters'
                            type="password"
                        />
                    </div>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <button type='submit' className={styles.signupSubmit}>
                    Create Account
                </button>

                {/* FOOTER */}
                <p className={styles.switchText}>
                    Already have an Account?{' '}
                    <button onClick={() => setCurrentPage('login')}
                        type='button' className={styles.signupSwitchButton}>
                        Sign In
                    </button>
                </p>
            </form>
        </div>
    )
}

export default SignUp;