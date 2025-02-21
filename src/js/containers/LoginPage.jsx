import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

import './LoginPage.scss';
import { getAuthErrorMsg, getAuthLoading } from '../selectors/app';
import { updateAuthErrorMsg as updateAuthErrorMsgRequest, userLogin as userLoginRequest } from '../actions/app';

const LoginPage = (props) => {
    const { authLoading, userLogin } = props;

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Form submitted:', formData);

            userLogin(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="card-header">
                    <h1 className="card-title">Welcome back</h1>
                    <p className="card-description">
                        Enter your email to sign in to your account
                    </p>
                </div>

                <div className="card-content">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    className={errors.email ? 'error' : ''}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <Mail className="input-icon" />
                            </div>
                            {errors.email && (
                                <p className="error-message">{errors.email}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className={errors.password ? 'error' : ''}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <Lock className="input-icon" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="toggle-password"
                                >
                                    {showPassword ? (
                                        <EyeOff className="icon" />
                                    ) : (
                                        <Eye className="icon" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="error-message">{errors.password}</p>
                            )}
                        </div>

                        <button type="submit" className="submit-button" disabled={authLoading}>
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

LoginPage.propTypes = {
    authLoading: PropTypes.bool,
    errorMsg: PropTypes.string,
    updateAuthErrorMsg: PropTypes.func,
    userLogin: PropTypes.func
}

const mapStateToProps = createStructuredSelector({
    authLoading: getAuthLoading(),
    errorMsg: getAuthErrorMsg()
});

const mapDispatchToProps = (dispatch) => ({
    updateAuthErrorMsg: (data) => dispatch(updateAuthErrorMsgRequest(data)),
    userLogin: (data) => dispatch(userLoginRequest(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);