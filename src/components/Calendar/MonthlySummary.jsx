// MonthlySummary.js
import React from 'react';

const MonthlySummary = ({ totalIncome, totalExpense }) => {

    return (
        <div className='p-5 sm:p-5'>
            <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <div>
                        <p className='font-semibold'>At 10 month</p>
                    </div>
                    <div className="flex space-x-4">
                        <p className='text-green-500'>Income: +${totalIncome}</p>
                        <p className='text-red-500'>Expense: -${totalExpense}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MonthlySummary;
