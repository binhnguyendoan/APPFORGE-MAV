import React, { useState, useEffect } from "react";
import { Calendar } from "zmp-ui";
import moment from "moment";
import NoteModal from "../NoteModal/NoteModal";
import MonthlySummary from "./MonthlySummary";
import Spending from "../Spending/Spending";
import './Mycalendar.css';

const Mycalendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notes, setNotes] = useState({});
    const [spendingData, setSpendingData] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [month, setMonth] = useState(10);
    const [year, setYear] = useState(2024);
    const [wallets, setWallets] = useState([]);
    const [categories, setCategories] = useState([]);



    const updateWalletBalance = async (walletId, amount, type) => {
        const wallet = wallets.find(w => w.id === walletId);
        if (!wallet) return;

        const newBalance = type === 'income'
            ? wallet.balance + amount
            : wallet.balance - amount;

        try {
            await fetch('https://appforge.mavsolutions.vn/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    query: `
                        mutation {
                            updateWalletBalance(walletId: ${walletId}, balance: ${newBalance}) {
                                id
                                balance
                            }
                        }
                    `
                })
            });

            setWallets(prevWallets =>
                prevWallets.map(w => w.id === walletId ? { ...w, balance: newBalance } : w)
            );
        } catch (error) {
            console.error('Error updating wallet balance:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactionsResponse = await fetch('https://appforge.mavsolutions.vn/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                    },
                    body: JSON.stringify({
                        query: `
                            query {
                                showDataTransactions(month: ${month}, year: ${year}) {
                                    date
                                    incomes { id amount wallet { id name } category { id name } date description }
                                    expenses { id amount wallet { id name } category { id name } date description }
                                }
                            }
                        `,
                    }),
                });

                const transactionsResult = await transactionsResponse.json();
                const transactionsData = transactionsResult.data.showDataTransactions;

                let incomeSum = 0;
                let expenseSum = 0;
                const newNotes = {};

                transactionsData.forEach((transaction) => {
                    const dateKey = moment(transaction.date).format('YYYY-MM-DD');
                    const totalIncome = transaction.incomes.reduce((sum, income) => sum + income.amount, 0);
                    const totalExpense = transaction.expenses.reduce((sum, expense) => sum + expense.amount, 0);

                    newNotes[dateKey] = {
                        incomes: transaction.incomes,
                        expenses: transaction.expenses,
                        totalIncome,
                        totalExpense,
                    };

                    incomeSum += totalIncome;
                    expenseSum += totalExpense;
                });

                setNotes(newNotes);
                setTotalIncome(incomeSum);
                setTotalExpense(expenseSum);

                const [walletsResponse, categoriesResponse] = await Promise.all([
                    fetch('https://appforge.mavsolutions.vn/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                        },
                        body: JSON.stringify({ query: `query { wallets { id name balance } }` }),
                    }),
                    fetch('https://appforge.mavsolutions.vn/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                        },
                        body: JSON.stringify({ query: `query { categories { id name type } }` }),
                    })
                ]);

                const walletsResult = await walletsResponse.json();
                const categoriesResult = await categoriesResponse.json();

                setWallets(walletsResult.data.wallets);
                setCategories(categoriesResult.data.categories);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [month, year]);

    useEffect(() => {
        if (selectedDate) {
            const dateKey = moment(selectedDate).format('YYYY-MM-DD');
            const dayData = notes[dateKey] || { incomes: [], expenses: [] };

            const spendingList = [
                ...dayData.incomes.map(income => ({ ...income, type: 'income' })),
                ...dayData.expenses.map(expense => ({ ...expense, type: 'expense' })),
            ];

            setSpendingData(spendingList);
            setIsModalOpen(true);
        }
    }, [selectedDate, notes]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const fullCellRender = (date) => {
        const dateKey = moment(date).format('YYYY-MM-DD');
        const note = notes[dateKey];

        return (
            <div className="p-2 text-center">
                <div>{date.getDate()}</div>
                {note && (
                    <div style={{ marginTop: '5px' }}>
                        {note.totalExpense > 0 && (
                            <div className="text-[13px] sm:text-sm" style={{ color: 'red' }}>- ${note.totalExpense.toLocaleString()} </div>
                        )}
                        {note.totalIncome > 0 && (
                            <div className="text-[13px] sm:text-sm" style={{ color: 'green' }}>+ ${note.totalIncome.toLocaleString()} </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const handleDeleteSpending = async (id) => {
        const spending = spendingData.find(s => s.id === id);

        if (spending) {
            const reverseType = spending.type === 'income' ? 'expense' : 'income';
            await updateWalletBalance(spending.wallet.id, spending.amount, reverseType);
            const dateKey = moment(spending.date).format('YYYY-MM-DD');
            const dayData = notes[dateKey] || { incomes: [], expenses: [] };

            let newTotalIncome = totalIncome;
            let newTotalExpense = totalExpense;

            if (spending.type === 'expense') {
                dayData.totalExpense -= spending.amount;
            } else {
                dayData.totalIncome -= spending.amount;
            }
            if (spending.type === 'expense') {
                newTotalExpense -= spending.amount;
            } else {
                newTotalIncome -= spending.amount;
            }
            setNotes(prevNotes => ({
                ...prevNotes,
                [dateKey]: {
                    ...dayData,
                    expenses: dayData.expenses.filter(exp => exp.id !== id),
                    incomes: dayData.incomes,
                },
            }));

            setSpendingData(prevData => prevData.filter(spending => spending.id !== id));

            setTotalIncome(newTotalIncome);
            setTotalExpense(newTotalExpense);
        }
    };


    const handleAddSpending = async (newSpending) => {
        if (newSpending.type === 'income' || newSpending.type === 'expense') {
            await updateWalletBalance(newSpending.wallet.id, newSpending.amount, newSpending.type);
        }
    };

    const handleUpdateSpending = (updatedSpending) => {
        const originalSpending = spendingData.find(spending => spending.id === updatedSpending.id);
        const difference = updatedSpending.amount - originalSpending.amount;
        const type = updatedSpending.type;

        if (difference !== 0) {
            updateWalletBalance(updatedSpending.wallet.id, difference, type);
        }

        setSpendingData(prevData =>
            prevData.map(spending =>
                spending.id === updatedSpending.id ? updatedSpending : spending
            )
        );
    };

    return (
        <div>
            <Calendar
                locale="en"
                onSelect={handleDateChange}
                fullCellRender={fullCellRender}
            />
            <MonthlySummary
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                month={month}
                year={year}
            />
            <Spending
                spendingData={spendingData}
                onDelete={handleDeleteSpending}
                onUpdate={handleUpdateSpending}
                onAdd={handleAddSpending}
                categories={categories}
                wallets={wallets}
            />

        </div>
    );
};

export default Mycalendar;
