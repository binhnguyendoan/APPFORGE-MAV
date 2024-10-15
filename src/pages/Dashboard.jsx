import React, { useState } from 'react';
import Main from '../components/Main/Main';
import Mycalendar from '../components/Calendar/Mycalendar';
import Spending from '../components/Spending/Spending';
import NoteModal from '../components/NoteModal/NoteModal';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import AddNote from '../components/NoteModal/AddNote';
const Dashboard = () => {

    return (
        <div className=''>
            <Navbar />
            <Mycalendar />
            {/* <Spending /> */}
            <AddNote />
            <Footer />
        </div>
    );
}

export default Dashboard;
