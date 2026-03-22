import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react';
import { useAdminAuthContext } from '../contexts/AdminAuthContext';
export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { signIn, signInLoading, signInError } = useAdminAuthContext();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        mode: 'onChange',
    });
    const onSubmit = async (data) => {
        try {
            signIn(data.email, data.password);
        }
        catch (err) {
            console.error('Login failed:', err);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Sappey Admin" }), _jsx("p", { className: "text-gray-600", children: "Sign in to administration panel" })] }), signInError && (_jsxs("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3", children: [_jsx(WarningCircle, { className: "text-red-600 flex-shrink-0 mt-0.5", size: 20 }), _jsx("p", { className: "text-red-800 text-sm", children: signInError?.response?.data?.message || signInError?.message || 'Login failed' })] })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }), _jsx("input", { id: "email", type: "email", placeholder: "admin@example.com", ...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        }), className: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'}` }), errors.email && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.email.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "password", type: showPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register('password', {
                                                    required: 'Password is required',
                                                    minLength: {
                                                        value: 6,
                                                        message: 'Password must be at least 6 characters',
                                                    },
                                                }), className: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}` }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700", children: showPassword ? _jsx(EyeSlash, { size: 20 }) : _jsx(Eye, { size: 20 }) })] }), errors.password && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.password.message }))] }), _jsx("button", { type: "submit", disabled: signInLoading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center", children: signInLoading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" }), "Signing in..."] })) : ('Sign In') })] }), _jsx("p", { className: "text-center text-gray-600 text-xs mt-6", children: "Authorized access only. All activities are logged and monitored." })] }) }) }));
}
