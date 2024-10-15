import React, { useState } from 'react';

const EditWalletModal = ({ isOpen, onClose, wallet, onSave, onDelete }) => {
    const [walletName, setWalletName] = useState(wallet?.name || '');
    const [balance, setBalance] = useState(wallet?.balance || 0);
    const [currency, setCurrency] = useState(wallet?.currency || 'VND');

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleSave = async () => {
        const response = await fetch('https://appforge.mavsolutions.vn/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
                query: `
                mutation {
                  updateWallet(id: "${wallet.id}", name: "${walletName}", balance: ${balance}, currency: "${currency}") {
                    id
                    name
                    balance
                    currency
                    created_at
                    updated_at
                  }
                }
                `,
            }),
        });
        const result = await response.json();
        if (result.errors) {
            console.error('Error updating wallet:', result.errors);
            setMessage('Error updating wallet.');
            setIsError(true);
        } else {
            const updatedWallet = result.data.updateWallet;
            onSave(updatedWallet);
            setMessage('Wallet updated successfully!');
            setIsError(false);
        }

    };

    const confirmDelete = () => {
        setShowConfirmDelete(true);
    };

    const handleDelete = async () => {
        const response = await fetch('https://appforge.mavsolutions.vn/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: JSON.stringify({
                query: `
                    mutation {
                      deleteWallet(id: "${wallet.id}") {
                        message
                      }
                    }
                `,
            }),
        });
        const result = await response.json();
        if (result.errors) {
            console.error('Error deleting wallet:', result.errors);
            setMessage('Error deleting wallet.');
            setIsError(true);
        } else {
            onDelete(wallet.id);
            setMessage('Wallet deleted successfully!');
            setIsError(false);
        }

        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
            onClose();
        }, 3000);
    };

    const handleConfirmDelete = () => {
        handleDelete();
        setShowConfirmDelete(false);
    };

    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-900 text-white w-full max-w-md p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button className="bg-green-500 px-4 py-2 rounded text-white" onClick={onClose}>Close</button>
                    <h2 className="text-2xl font-bold">Edit Wallet</h2>
                    <button className="bg-red-500 px-4 py-2 rounded text-white" onClick={confirmDelete}>Delete</button>
                </div>


                <div className="mb-4">
                    <label className="text-white">Wallet Name</label>
                    <input
                        className="block w-full p-2 mt-2 bg-gray-600 text-white rounded"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="text-white">Balance</label>
                    <input
                        className="block w-full p-2 mt-2 bg-gray-600 text-white rounded"
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="mb-4">
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
                <div className="flex justify-center items-center mb-4">
                    <button className="bg-blue-500 px-4 py-2 rounded text-white" onClick={handleSave}>Save</button>
                </div>
                {showMessage && (
                    <div className={`fixed z-100 top-4 right-4 px-[10rem] py-5 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg shadow-lg`}>
                        {message}
                    </div>
                )}

                {showConfirmDelete && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="bg-black p-[100px] rounded shadow-lg text-center">
                            <h2 className="text-lg text-white mb-4">Are you sure?</h2>
                            <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={handleConfirmDelete}>Delete it</button>
                            <button className="bg-gray-500 px-4 py-2 rounded text-white" onClick={handleCancelDelete}>Cancel</button>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditWalletModal;
