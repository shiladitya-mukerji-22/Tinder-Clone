import React from 'react'; 
import Nav from '../Components/Nav'
import AuthModal from '../Components/AuthModal';
import { useState } from 'react'

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true)

    const authToken = false;

    const handleClick = () => {
        console.log("button clicked");
        setShowModal(true);
        setIsSignUp(true);
    };

    return (
        <div className="overlay">
            <Nav
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />

            <div className="home">
                <h1 className='primary-title'>Start Something Epic</h1>
                <button className="primary-button" onClick={handleClick}>
                    {authToken ? "Sign Out" : "Create Account"}
                </button>

                {showModal &&
                    (<AuthModal setShowModal={setShowModal} isSignUp={isSignUp}/>
                    )}

            </div>


        </div>
    )
};

export default Home;