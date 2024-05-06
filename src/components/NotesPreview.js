import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

const NotesPreview = ({ notes, onClose }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const handleFilterChange = (event) => {
        const { value } = event.target;
        setSelectedMonth(parseInt(value));
    };

    const filteredNotes = Object.entries(notes).filter(([date]) => {
        const noteDate = new Date(date);
        return noteDate.getMonth() === selectedMonth;
    });

    const monthOptions = Array.from({ length: 12 }, (_, index) => {
        return { value: index, label: new Date(0, index).toLocaleString('default', { month: 'long' }) };
    });

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-10">
            <div className="bg-gray-300 text-black font-semibold p-4 rounded-lg w-full max-w-sm sm:max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg uppercase font-bold">All Notes</h3>
                    <button onClick={onClose} className="text-red-600 focus:outline-none"><MdClose size={25} /></button>
                </div>
                <div className="mb-4">
                    <label htmlFor="month">Month:</label>
                    <select name="month" id="month" value={selectedMonth} onChange={handleFilterChange} className="w-full">
                        {monthOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                {filteredNotes.length > 0 ? (
                    <ul className="p-3">
                        {filteredNotes.map(([date, note]) => (
                            <li key={date}>
                                <p className="text-lg"><strong><i>{new Date(date).toDateString()} : </i></strong>
                                    {note}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-red-600">No Notes Are Available For Selected Month .....</p>
                )}
            </div>
        </div>
    );
}

export default NotesPreview;
