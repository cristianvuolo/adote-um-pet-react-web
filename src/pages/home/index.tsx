import React from "react";
import './home.css'
import logo from '../../assets/logo.svg';
import {FiLogIn} from 'react-icons/fi'

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Adote um Pet"/>
                </header>
                <main>
                    <h1>
                        Adote um Pet
                        <br/>
                        Receba um Amigo
                    </h1>

                    <a href="/cadastro">
                       <span>
                           <FiLogIn />
                       </span>
                       <strong>Cadastre um Pet</strong>
                    </a>
                </main>
            </div>
        </div>
    )
}

export default Home;
