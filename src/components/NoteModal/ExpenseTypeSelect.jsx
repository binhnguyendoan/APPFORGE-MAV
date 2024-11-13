import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faWallet, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
function ExpenseTypeSelect({ setCategoryId }) {
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("https://appforge.mavsolutions.vn/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    query: `{
                        categories {
                            id
                            name
                            type
                        }
                    }`,
                }),
            });

            const result = await response.json();
            if (!result.errors) {
                const categories = result.data.categories.filter(category => category.type === 'expense');
                setExpenseCategories(categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const addCategory = async () => {
        try {
            const response = await fetch("https://appforge.mavsolutions.vn/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    query: `mutation {
                        createCategory(name: "${newCategoryName}", type: "expense") {
                            id
                            name
                            type
                        }
                    }`,
                }),
            });

            const result = await response.json();
            if (!result.errors) {
                setExpenseCategories([...expenseCategories, result.data.createCategory]);
                setNewCategoryName('');
                setIsAddingCategory(false);
                setMessage('Category added successfully');
                setIsError(false);
                setShowMessage(true);

                setTimeout(() => {
                    setShowMessage(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Error creating category:', error);
            setMessage('Failed to add category');
            setIsError(true);
            setShowMessage(true);

            setTimeout(() => {
                setShowMessage(false);
            }, 2000);
        }
    };

    const updateCategory = async () => {
        try {
            const response = await fetch("https://appforge.mavsolutions.vn/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    query: `mutation {
                        updateCategory(id: ${editCategoryId}, name: "${editCategoryName}", type: "expense") {
                            id
                            name
                            type
                        }
                    }`,
                }),
            });

            const result = await response.json();

            if (!result.errors) {
                const updatedCategory = result.data.updateCategory;
                setExpenseCategories(expenseCategories.map(cat =>
                    cat.id === updatedCategory.id ? updatedCategory : cat
                ));
                setIsEditingCategory(false);
                setEditCategoryId(null);
                setEditCategoryName('');
                setMessage('Category updated successfully');
                setIsError(false);
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Error updating category:', error);
            setMessage('Failed to update category');
            setIsError(true);
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 2000);
        }
    };

    const deleteCategory = async (id) => {
        try {
            const response = await fetch("https://appforge.mavsolutions.vn/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    query: `mutation {
                        deleteCategory(id: ${id}) {
                            message
                        }
                    }`,
                }),
            });

            const result = await response.json();

            if (!result.errors) {
                setExpenseCategories(expenseCategories.filter(cat => cat.id !== id));
                setMessage('Category deleted successfully');
                setIsError(false);
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setMessage('Failed to delete category');
            setIsError(true);
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 2000);
        }
    };


    return (
        <div className="mb-4">
            {showMessage && (
                <div className={`fixed top-4 right-4 px-[10rem] py-5 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg shadow-lg`}>
                    {message}
                </div>
            )}
            <label htmlFor="expense-type" className="block text-sm font-medium text-white">Expense type:</label>
            <div className="flex items-center">
                <select
                    id="expense-type"
                    value={selectedCategoryId}
                    onChange={(e) => {
                        setSelectedCategoryId(e.target.value);
                        setCategoryId(e.target.value);
                    }}
                    className="mt-1 block w-full bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-3"
                >
                    <option value="">Select Expense Type</option>
                    {expenseCategories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button onClick={() => setIsAddingCategory(!isAddingCategory)} className="ml-2 p-2 bg-green-600 text-white rounded">
                    +
                </button>
            </div>

            {selectedCategoryId && (
                <div className="mt-2 flex items-center justify-between">
                    <button
                        onClick={() => {
                            const category = expenseCategories.find(cat => cat.id === selectedCategoryId);
                            setIsEditingCategory(true);
                            setEditCategoryId(category.id);
                            setEditCategoryName(category.name);
                        }}
                        className="px-4 py-2 rounded bg-blue-500 "
                    >
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // Prevent dropdown from closing
                            deleteCategory(selectedCategoryId);
                        }}
                        className="text-white px-4 py-2 rounded bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            )}

            {isAddingCategory && (
                <div className="mt-2">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter new category name"
                        className="w-full p-2 border border-gray-700 rounded text-black"
                    />
                    <button onClick={addCategory} className="mt-2 w-full bg-blue-600 text-white p-2 rounded">
                        Add Category
                    </button>
                </div>
            )}

            {isEditingCategory && (
                <div className="mt-2">
                    <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        placeholder="Edit category name"
                        className="w-full p-2 border border-gray-700 rounded text-black"
                    />
                    <button onClick={updateCategory} className="mt-2 w-full bg-yellow-600 text-white p-2 rounded">
                        Update Category
                    </button>
                </div>
            )}
        </div>
    );
}

export default ExpenseTypeSelect;
