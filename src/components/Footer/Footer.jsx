import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const handleWallet = () => {
        navigate('/wallet');
    };

    const handleNote = () => {
        navigate('/dashboard');
    };

    const handleReport = () => {
        navigate('/report');
    };

    return (
        <div className="flex items-center justify-center relative mt-[10px] p-5 sm:p-11">
            <div className="flex gap-5">
                <button
                    onClick={handleWallet}
                    className={`text-lg px-6 py-2 rounded-lg ${location.pathname === '/wallet' ? 'bg-black text-white' : 'bg-white border-2 border-blue-500 text-black'}`}>
                    Wallet
                </button>
                <button
                    onClick={handleNote}
                    className={`text-lg px-6 py-2 rounded-lg ${location.pathname === '/dashboard' ? 'bg-black text-white' : 'bg-white border-2 border-blue-500 text-black'}`}>
                    Note
                </button>
                <button
                    onClick={handleReport}
                    className={`text-lg px-6 py-2 rounded-lg ${location.pathname === '/report' ? 'bg-black text-white' : 'bg-white border-2 border-blue-500 text-black'}`}>
                    Report
                </button>
            </div>
        </div>
    );
};

export default Footer;
