import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import env from "../configs/env"

export const Login = () => {
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();

    const handleButtoClick = (parameter) => {
        // Ovde nedostaje kod za logovanje
        let isLoggedIn = true;
        console.log("**************16**************")
        const usernameInput = document.getElementById("input").value; // Koristimo document.getElementById da bismo dohvatili vrijednost polja Username
        const passwordInput = document.getElementById("password-input").value; // Koristimo document.getElementById da bismo dohvatili vrijednost polja Password
        
        const requestData = {
          username: usernameInput,
          password: passwordInput
        };
        console.log("**************24**************")
        axios
        .post(`${env.JWT_BACK_URL}/adm/services/sign/in`, requestData)
        .then((response) => {
          isLoggedIn = response.status === 200; // Ako je status 200, isLoggedIn će biti true
           if (isLoggedIn) {
             //TODO idi na pocetnu stranicu
             localStorage.setItem('token', response.data.token);
             localStorage.setItem('refreshToken', response.data.refreshToken);
             navigate('/');
           } else {
             //TODO vrati se na login
             navigate('/login');
           }
        })
        .catch((error) => {
            navigate('/login');
        })
        .catch((error) => {
            console.error(error);
            isLoggedIn = false; // Ako se dogodila pogreška, isLoggedIn će biti false
            //TODO vrati se na login
          });        
    }    

    return (
        <div className="login-body">
            <div className="card login-panel p-fluid">
                <div className="login-panel-content">
                    <div className="grid">
                        <div className="col-12 sm:col-6 md:col-6 logo-container">
                            <img src="assets/layout/images/logo-roma.svg" alt="roma" />
                            <span className="guest-sign-in">Welcome, please use the form to sign-in Roma network</span>
                        </div>
                        <div className="col-12 username-container">
                            <label>Username</label>
                            <div className="login-input">
                                <InputText id="input" type="text" />
                            </div>
                        </div>
                        <div className="col-12 password-container">
                            <label>Password</label>
                            <div className="login-input">
                                <InputText id="password-input" type="password" />
                            </div>
                        </div>
                        <div className="col-12 sm:col-6 md:col-6 rememberme-container">
                            <Checkbox checked={checked} onChange={(e) => setChecked(e.checked)} />
                            <label> Remember me</label>
                        </div>

                        <div className="col-12 sm:col-6 md:col-6 forgetpassword-container">
                            <a href="/" className="forget-password">
                                Forget Password
                            </a>
                        </div>

                        <div className="col-12 sm:col-6 md:col-6">
                            <Button label="Sign In" icon="pi pi-check" onClick={() => handleButtoClick('app')}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
