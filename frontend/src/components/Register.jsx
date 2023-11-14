import React from 'react'
import { useRef, useState } from "react";
import axios from "axios";
import "./register.css"
import { FaMapMarkerAlt } from "react-icons/fa"
import { GiCancel } from "react-icons/gi"

export default function Register({ setShowRegister }) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            await axios.post("/users/register", newUser);
            setError(false);
            setSuccess(true);
        } catch (err) {
            setError(true);
        }
    };

    return (
        <div className='registerContainer'>
            <div className="logo">
                <FaMapMarkerAlt />
                ST Map
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='username' ref={usernameRef} />
                <input type="email" placeholder='email' ref={emailRef} />
                <input type="password" placeholder='password' ref={passwordRef} />
                <button className='registerBtn' type='submit'>Register</button>
                {success &&
                    <span className='success'>Successfully. You can login now!</span>
                }
                {error &&
                    <span className='failure'>Something went wrong!</span>
                }
                <GiCancel className='registerCancel' onClick={() => setShowRegister(false)} />
            </form>
        </div>
    )
}
