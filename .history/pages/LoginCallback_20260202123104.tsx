import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../lib/api';

const LoginCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            authAPI.loginWithDiscord(code)
                .then((res) => {
                    localStorage.setItem('vexon_token', res.data.token);
                    localStorage.setItem('vexon_user', JSON.stringify(res.data.user));
                    navigate('/dashboard');
                })
                .catch((err) => {
                    console.error('Login failed:', err);
                    navigate('/');
                });
        } else {
            navigate('/');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1016]">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-medium">Giriş yapılıyor, lütfen bekleyin...</p>
            </div>
        </div>
    );
};

export default LoginCallback;
