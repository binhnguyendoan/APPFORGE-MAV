import React, { useState, useEffect } from 'react';

function DateSelect({ setDate }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
    useEffect(() => {
        setDate(selectedDate);
    }, [selectedDate, setDate]);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <div className="mb-4">
            <label className="block text-white mb-2">Date</label>
            <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="bg-white text-black w-full p-2 rounded-lg"
            />
        </div>
    );
}

export default DateSelect;
