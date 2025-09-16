import React from 'react';
import PageTitle from '../assets/components/PageTitle';
import ProductSidebar from '../assets/components/ProductSidebar';
import Counter from '../assets/components/Counter';

const Home = () => {
    return (
        <>
            <PageTitle title="Home" />
            <div className="container flex-space-around">
                <div className="sidebar-container">
                    <ProductSidebar />
                </div>
                <div className="main-container">
                    <h2>List of all products</h2>
                </div>
                <Counter />
            </div>
        </>
    );
};

export default Home;
