import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Walletcontent from '../components/Wallet/Walletcontent';
import AddWallet from '../components/Wallet/AddWallet';
const Wallet = () => {
    return (
        <div>
            <Navbar />
            <Walletcontent />
            {/* <AddWallet /> */}
            <Footer />
        </div>
    );
}

export default Wallet;
