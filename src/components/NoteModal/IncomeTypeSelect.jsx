import React, { useEffect, useState } from 'react';

function IncomeTypeSelect({ setCategoryId }) {
    const [incomeCategories, setIncomeCategories] = useState([]);

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
                console.log(result);

                if (result.errors) {
                    console.error('Error fetching categories:', result.errors);
                } else {
                    const categories = result.data.categories.filter(category => category.type === 'income');
                    console.log(categories);

                    setIncomeCategories(categories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (

        <div className='mb-4'>
            <label htmlFor="expense-type" className="block text-sm font-medium text-white">Income type:</label>
            <select
                id="expense-type"
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 block w-full bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-3"
            >
                <option value="">Select Income Type</option>
                {incomeCategories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>

    );
}

export default IncomeTypeSelect;
