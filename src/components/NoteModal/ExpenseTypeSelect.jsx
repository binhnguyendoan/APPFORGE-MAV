import React, { useState, useEffect } from 'react';

function ExpenseTypeSelect({ setCategoryId }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [expenseCategories, setExpenseCategories] = useState([]);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    // Fetch the categories on component mount
    useEffect(() => {
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
                        } 
                        `,
                    }),
                });

                const result = await response.json();


                if (result.errors) {
                    console.error('Error fetching categories:', result.errors);
                } else {
                    const categories = result.data.categories.filter(category => category.type === 'expense');
                    setExpenseCategories(categories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className='mb-4'>
            <label htmlFor="expense-type" className="block text-sm font-medium text-white">Expense type:</label>
            <select
                id="expense-type"
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 block w-full bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-3"
            >
                <option value="">Select Expense Type</option>
                {expenseCategories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ExpenseTypeSelect;
