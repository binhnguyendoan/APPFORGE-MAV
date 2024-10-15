import React, { useState } from 'react';

const WalletModal = ({ isOpen, onClose, onWalletCreated }) => {
    const [walletName, setWalletName] = useState('');
    const [walletBalance, setWalletBalance] = useState(0);
    const [currency, setCurrency] = useState('VND');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const userId = localStorage.getItem('user_id');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const query = `
            mutation {
                createWallet(name: "${walletName}", balance: ${walletBalance}, currency: "${currency}") {
                    id,
                    user_id,
                    name,
                    balance,
                    currency
                }
            }
        `;

        try {
            const response = await fetch("https://appforge.mavsolutions.vn/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ query }),
            });

            const result = await response.json();
            if (result.errors) {
                setMessage("Error creating wallet: " + result.errors[0].message);
                setIsError(true);
                setShowMessage(true);

            } else {
                const newWallet = result.data.createWallet;
                setMessage("Wallet created successfully!");
                setIsError(false);
                setShowMessage(true);
                onWalletCreated(newWallet);
                setTimeout(() => {
                    setShowMessage(false);
                    onClose();
                }, 2000);
            }
        } catch (error) {
            setMessage("Error creating wallet: " + error.message);
            setIsError(true);
            setShowMessage(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className='bg-gray-900 text-white w-full max-w-md p-8 rounded-lg shadow-lg'>
                <div className="flex justify-between items-center mb-4">
                    <button className="bg-green-500 px-4 py-2 rounded text-white" onClick={onClose}>Close</button>
                    <h2 className="text-2xl font-bold">Create Wallet</h2>
                    <button className="bg-red-500 px-4 py-2 rounded text-white" form="walletForm">Save</button>
                </div>

                {showMessage && (
                    <div className={`fixed top-4 right-4 px-[10rem] py-5 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg shadow-lg`}>
                        {message}
                    </div>
                )}

                <form id="walletForm" className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-white text-sm mb-2" htmlFor="walletName">
                            Wallet Name
                        </label>
                        <input
                            type="text"
                            id="walletName"
                            className="w-full p-2 border border-gray-500 rounded-lg bg-gray-700 text-white"
                            value={walletName}
                            onChange={(e) => setWalletName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm mb-2" htmlFor="walletBalance">
                            Wallet Balance
                        </label>
                        <input
                            type="number"
                            id="walletBalance"
                            className="w-full p-2 border border-gray-500 rounded-lg bg-gray-700 text-white"
                            value={walletBalance}
                            onChange={(e) => setWalletBalance(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm mb-2" htmlFor="currency">
                            Currency
                        </label>
                        <select
                            id="currency"
                            className="w-full p-2 border border-gray-500 rounded-lg bg-gray-700 text-white"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option value="VND">VND</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>


                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-300"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WalletModal;
