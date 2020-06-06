import React from "react";
import './home.css'
import logo from '../../assets/logo.svg';
import {FiLogIn} from 'react-icons/fi'
import { Link } from 'react-router-dom'

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

                    <Link to="/create-point">
                       <span>
                           <FiLogIn />
                       </span>
                       <strong>Cadastre um Pet</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home;
