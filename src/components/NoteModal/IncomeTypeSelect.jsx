import React, { useEffect, useState } from 'react';

function IncomeTypeSelect({ setCategoryId }) {
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

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
                const categories = result.data.categories.filter(category => category.type === 'income');
                setIncomeCategories(categories);
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
                        createCategory(name: "${newCategoryName}", type: "income") {
                            id
                            name
                            type
                        }
                    }`,
                }),
            });

            const result = await response.json();
            if (!result.errors) {
                setIncomeCategories([...incomeCategories, result.data.createCategory]);
                setNewCategoryName('');
                setIsAddingCategory(false);
                setMessage('Income category added successfully');
                setIsError(false);
                setShowMessage(true);

                setTimeout(() => setShowMessage(false), 2000);
            }
        } catch (error) {
            console.error('Error adding category:', error);
            setMessage('Failed to add category');
            setIsError(true);
            setShowMessage(true);

            setTimeout(() => setShowMessage(false), 2000);
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
                        updateCategory(id: ${editCategoryId}, name: "${editCategoryName}", type: "income") {
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
                setIncomeCategories(incomeCategories.map(cat =>
                    cat.id === updatedCategory.id ? updatedCategory : cat
                ));
                setIsEditingCategory(false);
                setEditCategoryId(null);
                setEditCategoryName('');
                setMessage('Income category updated successfully');
                setIsError(false);
                setShowMessage(true);

                setTimeout(() => setShowMessage(false), 2000);
            }
        } catch (error) {
            console.error('Error updating category:', error);
            setMessage('Failed to update category');
            setIsError(true);
            setShowMessage(true);

            setTimeout(() => setShowMessage(false), 2000);
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
                setIncomeCategories(incomeCategories.filter(cat => cat.id !== id));
                setMessage('Income category deleted successfully');
                setIsError(false);
                setShowMessage(true);

                setTimeout(() => setShowMessage(false), 2000);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setMessage('Failed to delete category');
            setIsError(true);
            setShowMessage(true);

            setTimeout(() => setShowMessage(false), 2000);
        }
    };

    return (
        <div className='mb-4'>
            <label htmlFor="income-type" className="block text-sm font-medium text-white">Income type:</label>
            <div className="flex items-center">
                <select
                    id="income-type"
                    onChange={(e) => {
                        setCategoryId(e.target.value);
                        setSelectedCategoryId(e.target.value);
                    }}
                    className="mt-1 block w-full bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-3"
                >
                    <option value="">Select Income Type</option>
                    {incomeCategories.map(category => (
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
                            const category = incomeCategories.find(cat => cat.id === selectedCategoryId);
                            setIsEditingCategory(true);
                            setEditCategoryId(category.id);
                            setEditCategoryName(category.name);
                        }}
                        className="px-4 py-2 rounded bg-blue-500"
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

            {showMessage && (
                <div className={`fixed top-4 right-4 px-[10rem] py-5 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg shadow-lg`}>
                    {message}
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

export default IncomeTypeSelect;
