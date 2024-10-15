import React, { useEffect, useState } from 'react';

function ExpenseCategoryList() {
    const [expenseCategories, setExpenseCategories] = useState([]);

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
                    const categories = result.data.categories.filter(category => category.type === 'expense');
                    console.log(categories);

                    setExpenseCategories(categories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="bg-white shadow-md rounded-md mt-2">
            <ul className="max-h-60 overflow-y-auto">
                {expenseCategories.map(category => (
                    <li key={category.id} className="px-4 py-2 border-b hover:bg-gray-100">
                        {category.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ExpenseCategoryList;
