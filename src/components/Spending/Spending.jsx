import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faWallet, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import EditModal from '../NoteModal/EditModal';

const Spending = ({ spendingData, onDelete, onUpdate, wallets, categories }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedSpending, setSelectedSpending] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleEdit = (spending) => {
        setSelectedSpending(spending);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedSpending(null);
    };

    const handleDeleteClick = (spending) => {
        setSelectedSpending(spending);
        setShowConfirmDelete(true);
    };

    const confirmDelete = async () => {
        if (!selectedSpending) return;
        const { id, type, amount, wallet } = selectedSpending;
        const walletId = wallet.id;

        const mutationDelete = type === 'expense'
            ? `mutation { deleteExpense(id: ${id}) { message } }`
            : `mutation { deleteIncome(id: ${id}) { message } }`;

        try {
            const response = await fetch('https://appforge.mavsolutions.vn/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ query: mutationDelete }),
            });

            const result = await response.json();

            if (result.data) {
                const currentWallet = wallets.find(wallet => wallet.id === walletId);
                const currentBalance = currentWallet ? currentWallet.balance : 0;
                const newBalance = type === 'expense' ? currentBalance + amount : currentBalance - amount;

                const mutationUpdateWallet = `  
                    mutation {  
                        updateWallet(id: ${walletId}, balance: ${newBalance}, currency: "USD") {  
                            id  
                            balance  
                            currency  
                        }  
                    }  
                `;

                const responseUpdate = await fetch('https://appforge.mavsolutions.vn/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                    },
                    body: JSON.stringify({ query: mutationUpdateWallet }),
                });

                const resultUpdate = await responseUpdate.json();

                if (resultUpdate.data) {
                    onDelete(id, type);
                } else {
                    console.error('Error updating wallet:', resultUpdate.errors);
                }
            } else {
                console.error('Error deleting spending:', result.errors);
            }
        } catch (error) {
            console.error('Error deleting spending:', error);
        } finally {
            setShowConfirmDelete(false);
        }
    };

    return (
        <div>
            <div className='p-5 sm:p-5' style={{ maxHeight: '150px', overflowY: 'auto' }}>
                <div className="flex-col">
                    {spendingData.map((spending, index) => (
                        <div key={index} className='flex justify-between mt-3'>
                            <div className='flex'>
                                <FontAwesomeIcon
                                    icon={spending.type === 'expense' ? faShoppingCart : faWallet}
                                    className='text-[20px]'
                                />
                                <div className='flex ml-2'>
                                    <p>{spending.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <p className={spending.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                                    {spending.type === 'income' ? `+ $${Math.abs(spending.amount)}` : `- $${Math.abs(spending.amount)}`}
                                </p>
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className='text-gray-600 ml-2 cursor-pointer'
                                    onClick={() => handleEdit(spending)}
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className='text-gray-600 ml-2 cursor-pointer'
                                    onClick={() => handleDeleteClick(spending)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && selectedSpending && (
                <EditModal
                    spending={selectedSpending}
                    categories={categories}
                    wallets={wallets}
                    onClose={handleCloseModal}
                    onUpdate={onUpdate}
                />
            )}
            {showConfirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-black p-[100px] rounded shadow-lg text-center">
                        <p className="text-lg text-white mb-4">Are you sure you want to delete this item?</p>
                        <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={confirmDelete}>Delete It</button>
                        <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={() => setShowConfirmDelete(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Spending;