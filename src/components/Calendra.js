import React, { useState, useEffect } from 'react';
import { AiOutlineBars } from 'react-icons/ai';
import { IoIosArrowBack, IoIosArrowForward, IoIosClose } from "react-icons/io";
import NotesPreview from './NotesPreview';

const Calendra = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [userInput, setUserInput] = useState("");
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem('calendra_notes');
        return savedNotes ? JSON.parse(savedNotes) : {};
    });
    const [showAllNotes, setShowAllNotes] = useState(false);

    useEffect(() => {
        const savedNotes = localStorage.getItem('calendra_notes');
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('calendra_notes', JSON.stringify(notes));
    }, [notes]);

    const generateDaysOfWeek = () => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return daysOfWeek.map(day => (
            <div key={day} className="text-center text-gray-600">{day}</div>
        ));
    };

    const generateCalendarDays = (year, month) => {
        const days = [];
        const today = new Date();
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        const startDay = startDate.getDay();

        const handleDateClick = (day) => {
            setSelectedDate(day);
            const note = notes[day.toDateString()] || "";
            setModalContent(note);
            setUserInput(note);
            setShowModal(true);
        };

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="border border-transparent "></div>);
        }

        for (let i = 1; i <= endDate.getDate(); i++) {
            const currentDate = new Date(year, month, i);
            const isToday = currentDate.toDateString() === today.toDateString();
            const isSaturday = currentDate.getDay() === 6;
            const isSunday = currentDate.getDay() === 0;
            const hasNote = notes[currentDate.toDateString()];
            const dayClasses = `border text-center rounded-lg py-5 ${isToday ? 'bg-red-600' : ''} ${isSaturday || isSunday ? 'text-red-500' : ''} ${hasNote ? 'text-green-500 underline underline-offset-4 ' : ''}`;

            days.push(
                <div key={i} className={dayClasses} onClick={() => handleDateClick(currentDate)}>
                    {i}
                </div>
            );
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1));
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleEnterNote = () => {
        if (selectedDate && userInput.trim() !== "") {
            setNotes(prevNotes => ({
                ...prevNotes,
                [selectedDate.toDateString()]: userInput.trim()
            }));
            setShowModal(false);
        }
    };

    const handleDeleteNote = () => {
        const updatedNotes = { ...notes };
        delete updatedNotes[selectedDate.toDateString()];
        setNotes(updatedNotes);
        setShowModal(false);
    };

    const handleShowAllNotes = () => {
        setShowAllNotes(true);
    };

    const handleCloseNotesPreview = () => {
        setShowAllNotes(false);
    };

    const handleClearNotes = () => {
        localStorage.removeItem('calendra_notes');
        setNotes({});
    };

    return (
        <div className='w-screen min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 '>
            <div className="mx-auto max-w-lg">
                <div className="flex flex-col sm:flex-row justify-between text-red-600 items-center mb-4">
                    <div className=" flex justify-between items-center w-full ">
                        <button onClick={handlePrevMonth} className="px-2 py-1 font-bold rounded hover:scale-110 duration-500 focus:outline-none"><IoIosArrowBack size={20} /></button>
                        <h2 className="text-lg font-semibold">{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>

                        <button className=''>
                            <AiOutlineBars size={20} onClick={handleShowAllNotes} />
                            </button>

                        <button onClick={handleNextMonth} className="px-2 py-1 ml-2 font-bold rounded hover:scale-110 duration-500 focus:outline-none"><IoIosArrowForward size={20} /></button>
                    </div>

                </div>
                <div className="grid grid-cols-7 px-1 gap-1">
                    {generateDaysOfWeek()}
                    {generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth())}
                </div>
            </div>
            {showModal && selectedDate && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-gray-400 text-black font-semibold p-4 rounded-lg">
                        <div className='flex justify-between items-center mb-2'>
                            <p>Date: {selectedDate.toDateString()}</p>
                            <button className="text-red-600" onClick={() => setShowModal(false)}>
                                <IoIosClose size={28} />
                            </button>
                        </div>
                        <input type="text" value={userInput} onChange={handleInputChange} placeholder='enter the notes...' className="border border-gray-600 rounded-full px-6 py-2 mt-2 mb-2 w-full" />
                        <div className='text-center'>
                            <button className="text-red-600 bg-gray-900 hover:bg-gray-300 duration-300 border-2 px-6 rounded-md" onClick={handleEnterNote}>ENTER</button>

                            {modalContent && (
                                <button className="text-red-600 bg-gray-900 hover:bg-gray-300 duration-300 border-2 px-6 rounded-md ml-2" onClick={handleDeleteNote}>DELETE</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showAllNotes && (
                <NotesPreview notes={notes} onClose={handleCloseNotesPreview} />
            )}
            <div className="absolute top-0 right-2 mr-4 mb-4 sm:py-3 py-2 text-xs">
                <button onClick={handleClearNotes} className="bg-red-600 text-white px-4 py-2 sm:px-5 sm:py-2 hover:bg-lime-500 duration-300 rounded-lg font-semibold">CLEAR NOTES</button>
            </div>

        </div>
    );
}

export default Calendra;
