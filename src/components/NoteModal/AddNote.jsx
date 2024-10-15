
import React, { useState } from 'react';
import NoteModal from './NoteModal';
const AddNote = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    }
    return (
        <div className='mt-8'>
            <div className='flex items-center justify-center  relative'>
                <button
                    onClick={openModal}
                    className="absolute bottom-[0px]  bg-green-500 text-white text-2xl h-16 w-16 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    +
                </button>
                <NoteModal isOpen={isModalOpen} onClose={closeModal} />

            </div>
        </div>
    );
}

export default AddNote;
