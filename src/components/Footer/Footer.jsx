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
                    className={`text-lg px-6 py-2 rounded-lg ${location.pathname === '/wallet' ? 'bg-black  text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600' : 'bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600'}`}>
                    Wallet
                </button>
                <button
                    onClick={handleNote}
                    className={`text-lg px-6 py-2 rounded-lg ${location.pathname === '/dashboard' ? 'bg-black  text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 hover:bg-green-600' : 'bg-green-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 hover:bg-green-600'}`}>
                    Note
                </button>

            </div>
        </div>
    );
};

export default Footer;
