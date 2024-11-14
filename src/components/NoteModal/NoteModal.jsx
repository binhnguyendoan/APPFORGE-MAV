import React, { useState, useEffect } from 'react';
import ExpenseTypeSelect from './ExpenseTypeSelect';
import IncomeTypeSelect from './IncomeTypeSelect';
import DateSelect from './DateSelect';

const NoteModal = ({ isOpen, onClose }) => {
    const [noteType, setNoteType] = useState('expense');
    const [wallets, setWallets] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [showWalletSelect, setShowWalletSelect] = useState(false);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const userId = localStorage.getItem('user_id');

    const handleAmountChange = (e) => {
        const value = e.target.value;

        if (!isNaN(value) && parseFloat(value) >= 0) {
            setAmount(value);
        } else {
            setMessage('Please enter a positive number.');
            setIsError(true);
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 2000);
        }
    };


    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const response = await fetch('https://appforge.mavsolutions.vn/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                    },
                    body: JSON.stringify({
                        query: `
                                {
                                    wallets {
                                        id,
                                        user_id,
                                        name,
                                        balance,
                                        currency,
                                        created_at,
                                        updated_at
                                    }
                                }
                            `,
                    }),
                });
                const result = await response.json();
                setWallets(result.data.wallets);
            } catch (error) {
                console.error('Error fetching wallets:', error);
            }
        };

        if (isOpen) {
            fetchWallets();
        }
    }, [isOpen, userId]);

    const handleSave = async () => {
        if (!selectedWallet || !amount || !date || !categoryId) {
            setMessage('Please fill in all information.');
            setIsError(true);
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 2000);
            return;
        }
        const noteMutation = `
                mutation {
                    ${noteType === 'expense' ? 'createExpense' : 'createIncome'}(
                        category_id: ${categoryId},
                        wallet_id: ${selectedWallet.id},
                        amount: ${parseFloat(amount)},
                        date: "${date}",
                        description: "${description}"
                    ) {
                        id
                        user_id
                        amount
                        date
                        description
                        category {
                            id
                            name
                        }
                        wallet {
                            id
                            name
                            balance
                        }
                    }
                }
            `;

        try {

            const noteResponse = await fetch('https://appforge.mavsolutions.vn/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ query: noteMutation }),
            });

            const noteResult = await noteResponse.json();

            if (noteResult.errors) {
                console.error(`Error creating ${noteType}:`, noteResult.errors);
                setMessage(`Error creating ${noteType}: ` + noteResult.errors[0].message);
                setIsError(true);
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 2000);
                return;
            }


            const updatedBalance = noteType === 'expense'
                ? selectedWallet.balance - parseFloat(amount)
                : selectedWallet.balance + parseFloat(amount);


            const updateMutation = `
                    mutation {
                        updateWallet(
                            id: "${selectedWallet.id}",
                            balance: ${updatedBalance},
                            currency: "${selectedWallet.currency}"
                        ) {
                            id
                            balance
                        }
                    }
                `;

            const updateResponse = await fetch('https://appforge.mavsolutions.vn/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ query: updateMutation }),
            });

            const updateResult = await updateResponse.json();

            if (updateResult.errors) {
                console.error('Error updating wallet:', updateResult.errors);
                setMessage('Error updating wallet: ' + updateResult.errors[0].message);
                setIsError(true);
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 2000);
            } else {
                console.log('Wallet updated successfully:', updateResult.data);
                setMessage(`${noteType.charAt(0).toUpperCase() + noteType.slice(1)} created and wallet updated successfully!`);
                setIsError(false);
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                    onClose();
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage(`Error creating ${noteType} or updating wallet.`);
            setIsError(true);
            setShowMessage(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-900 text-white w-full max-w-md p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button className="bg-red-500 px-4 py-2 rounded text-white" onClick={onClose}>Close</button>
                    <h2 className="text-2xl font-bold">Note</h2>
                    <button className="bg-green-500 px-4 py-2 rounded text-white" onClick={handleSave}>Save</button>
                </div>
                {showMessage && (
                    <div className={`fixed top-4 right-4 px-[10rem] py-5 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg shadow-lg`}>
                        {message}
                    </div>
                )}


                <div className="flex justify-center mb-4">
                    <button
                        className={`px-4 py-2 mr-2 rounded-lg ${noteType === 'expense' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setNoteType('expense')}
                    >
                        Expense
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${noteType === 'income' ? 'bg-green-500 text-white' : 'bg-white text-black'}`}
                        onClick={() => setNoteType('income')}
                    >
                        Income
                    </button>
                </div>

                <div className="text-center mb-4">
                    <h3 className="text-lg">Amount</h3>
                    <input
                        type="text"
                        className="bg-gray-700 text-white text-center w-full py-2 rounded-lg mt-2"
                        placeholder="0 $"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                </div>

                {noteType === 'expense' ? <ExpenseTypeSelect setCategoryId={setCategoryId} /> : <IncomeTypeSelect setCategoryId={setCategoryId} />}
                <DateSelect setDate={setDate} />

                <div className="mb-4">
                    <label className="block text-white mb-2">From wallet: </label>
                    <button
                        className="bg-blue-600 text-white w-full py-2 rounded-lg"
                        onClick={() => setShowWalletSelect(!showWalletSelect)}
                    >
                        {selectedWallet ? selectedWallet.name : 'Select Wallet'}
                    </button>
                    {showWalletSelect && (
                        <div className="bg-gray-800 rounded-lg mt-2">
                            {wallets.map(wallet => (
                                <button
                                    key={wallet.id}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                                    onClick={() => {
                                        setSelectedWallet(wallet);
                                        setShowWalletSelect(false);
                                    }}
                                >
                                    {wallet.name} - {wallet.balance} {wallet.currency}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <textarea
                        className="bg-gray-700 text-white w-full py-2 rounded-lg p-2"
                        placeholder="Note here"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="text-center">
                    <button className="bg-purple-700 text-white px-6 py-2 rounded-lg" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;
