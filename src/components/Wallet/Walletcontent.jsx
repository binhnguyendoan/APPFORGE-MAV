import React, { useState, useEffect } from 'react';
import AddWallet from './AddWallet';
import EditWalletModal from './EditWalletModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

const Walletcontent = () => {
    const [wallets, setWallets] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWallet, setSelectedWallet] = useState(null);

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const response = await fetch("https://appforge.mavsolutions.vn/graphql", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                    },
                    body: JSON.stringify({
                        query: `{
                            wallets {
                                id,
                                user_id,
                                name,
                                balance,
                                currency,
                                created_at,
                                updated_at
                            }
                        }`,
                    }),
                });

                const result = await response.json();
                if (result.errors) {
                    console.error("Error fetching wallets:", result.errors);
                    setError("Error fetching wallets");
                } else if (result.data && result.data.wallets) {
                    const allWallets = result.data.wallets;
                    const userWallets = allWallets.filter(wallet => wallet.user_id === userId);
                    setWallets(userWallets);
                    const total = userWallets.reduce((sum, wallet) => sum + wallet.balance, 0);
                    setTotalBalance(total);
                } else {
                    setError("No data available");
                }
            } catch (error) {
                console.error("Error fetching wallets:", error);
                setError("Error fetching wallets");
            } finally {
                setLoading(false);
            }
        };

        fetchWallets();
    }, [userId]);

    const handleWalletCreated = (newWallet) => {
        setWallets((prevWallets) => [...prevWallets, newWallet]);
        setTotalBalance((prevTotal) => prevTotal + newWallet.balance);
    };

    const handleEditWallet = (wallet) => {
        setSelectedWallet(wallet);
    };

    const handleCloseModal = () => {
        setSelectedWallet(null);
    };

    const handleSaveWallet = (updatedWallet) => {
        setWallets((prevWallets) =>
            prevWallets.map(wallet => (wallet.id === updatedWallet.id ? updatedWallet : wallet))
        );
        handleCloseModal();
    };
    const handleDeleteWallet = (walletId) => {

        setWallets((prevWallets) => prevWallets.filter(wallet => wallet.id !== walletId));
    };

    if (loading) {
        return <div className='text-white'>Loading...</div>;
    }

    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }

    return (
        <div className='h-[500px] bg-black'>
            <div className='flex justify-between items-center p-5 sm:p-11'>
                <h2 className='text-white'>Total</h2>
                <h2 className='text-white'>${totalBalance > 0 ? totalBalance : '0'} </h2>
            </div>
            <div className='h-1 bg-white'></div>
            <div className='flex flex-col sm:p-11 p-5' style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {wallets.length > 0 ? (
                    wallets.map((wallet) => (
                        <div key={wallet.id} className='text-white flex justify-between items-center mb-5 cursor-pointer hover:bg-gray-500 p-2' onClick={() => handleEditWallet(wallet)}>
                            <h2>
                                <FontAwesomeIcon icon={faWallet} className="text-white mr-2 text-xl" />
                                {wallet.name}
                            </h2>
                            <p>${wallet.balance}</p>
                        </div>
                    ))
                ) : (
                    <div className='text-white mb-5'>
                        <p>There are no wallets. Please add a new wallet.</p>
                    </div>
                )}
            </div>
            <AddWallet onWalletCreated={handleWalletCreated} />


            {selectedWallet && (
                <EditWalletModal
                    isOpen={!!selectedWallet}
                    wallet={selectedWallet}
                    onClose={handleCloseModal}
                    onSave={handleSaveWallet}
                    onDelete={handleDeleteWallet}
                />
            )}
        </div>
    );
};

export default Walletcontent;
