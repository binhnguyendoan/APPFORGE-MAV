import React, { useState } from 'react';
import WalletModal from './WalletModal';
const AddWallet = ({ onWalletCreated }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    }
    return (
        <div>
            <div className='mt-8'>
                <div className='flex items-center justify-center  relative'>
                    <button
                        onClick={openModal}
                        className="absolute top-[100px]  bg-green-500 text-white text-2xl h-16 w-16 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        +
                    </button>
                    <WalletModal isOpen={isModalOpen} onClose={closeModal} onWalletCreated={onWalletCreated} />

                </div>
            </div>
        </div>
    );
}

export default AddWallet;
