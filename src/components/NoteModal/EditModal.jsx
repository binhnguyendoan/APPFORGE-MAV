import React, { useState } from 'react';

const EditModal = ({ spending, wallets, categories, onClose, onUpdate }) => {
    const [amount, setAmount] = useState(spending.amount);
    const [description, setDescription] = useState(spending.description);
    const [date, setDate] = useState(spending.date);
    const [walletId, setWalletId] = useState(spending.wallet.id);
    const [categoryId, setCategoryId] = useState(spending.category.id);
    const [type, setType] = useState(spending.type);
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [isError, setIsError] = useState(false);
    const handleUpdate = async () => {

        const mutation = type === 'expense'
            ? `mutation { updateExpense(id: ${spending.id}, category_id: ${categoryId}, wallet_id: ${walletId}, amount: ${amount}, date: "${date}", description: "${description}") { id amount date description category { id name } wallet { id name } } }`
            : `mutation { updateIncome(id: ${spending.id}, category_id: ${categoryId}, wallet_id: ${walletId}, amount: ${amount}, date: "${date}", description: "${description}") { id amount date description category { id name } wallet { id name } } }`;

        try {

            const response = await fetch('https://appforge.mavsolutions.vn/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ query: mutation }),
            });

            const result = await response.json();

            if (result.data) {
                const updatedSpending = type === 'expense' ? result.data.updateExpense : result.data.updateIncome;
                const oldAmount = spending.amount;
                const newAmount = amount;
                const balanceDifference = type === 'expense'
                    ? oldAmount - newAmount
                    : newAmount - oldAmount;


                const currentWallet = wallets.find(wallet => wallet.id === walletId);


                const newBalance = currentWallet.balance + balanceDifference;


                const balanceMutation = `
                    mutation {
                        updateWallet(id: "${walletId}", balance: ${newBalance}, currency: "USD") {
                            id
                            balance
                            currency
                        }
                    }
                `;

                const balanceResponse = await fetch('https://appforge.mavsolutions.vn/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                    body: JSON.stringify({ query: balanceMutation }),
                });

                const balanceResult = await balanceResponse.json();

                if (balanceResult.data) {
                    onUpdate(updatedSpending);
                    setMessage('Updated Successfully:!');
                    setIsError(false);
                } else {
                    setMessage('Error updating');
                    setIsError(true);

                }
            }
        } catch (error) {
            setMessage('Error updating spending.');
            setIsError(true);
        }
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
            onClose();
        }, 3000);
    };


    const handleToggleType = () => {
        const newType = type === 'income' ? 'expense' : 'income';
        setType(newType);
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-900 text-white w-full max-w-md p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button className="text-white" onClick={onClose}>Close</button>
                    <h2 className="text-2xl font-bold">Edit Spending</h2>
                    <button className="text-white" onClick={handleUpdate}>Edit</button>
                </div>
                {showMessage && (
                    <div className={`fixed top-4 right-4 px-[10rem] py-5 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg shadow-lg`}>
                        {message}
                    </div>
                )}


                <div className="mb-4">
                    <h3 className="text-lg">Amount</h3>
                    <input
                        type="number"
                        className="bg-gray-700 text-white text-center w-full py-2 rounded-lg mt-2"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        placeholder="Amount $"
                    />
                </div>

                <div className="mb-4">
                    <h3 className="text-lg">Description</h3>
                    <input
                        type="text"
                        className="bg-gray-700 text-white text-center w-full py-2 rounded-lg mt-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                    />
                </div>

                <div className="mb-4">
                    <h3 className="text-lg">Date</h3>
                    <input
                        type="date"
                        className="bg-gray-700 text-white text-center w-full py-2 rounded-lg mt-2"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <h3 className="text-lg">Wallet</h3>
                    <select
                        className="bg-gray-700 text-white text-center w-full py-2 rounded-lg mt-2"
                        value={walletId}
                        onChange={(e) => setWalletId(parseInt(e.target.value))}
                    >
                        {wallets.map((wallet) => (
                            <option key={wallet.id} value={wallet.id}>
                                {wallet.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg">Category</h3>
                    <select
                        className="bg-gray-700 text-white text-center w-full py-2 rounded-lg mt-2"
                        value={categoryId}
                        onChange={(e) => setCategoryId(parseInt(e.target.value))}
                    >
                        {categories
                            .filter((category) => category.type === type)
                            .map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="mb-4">
                    <button
                        onClick={handleToggleType}
                        className={`w-full py-2 px-4 rounded text-white 
                         ${type === 'income' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        Switch to {type === 'income' ? 'Expense' : 'Income'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditModal;
