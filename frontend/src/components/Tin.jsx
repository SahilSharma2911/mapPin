import React from 'react'
import { useRef, useState } from "react";
import axios from "axios";
import "./tin.css"
import { FaMapMarkerAlt } from "react-icons/fa"
import { GiCancel } from "react-icons/gi"

export default function Tin({setShowLogin,myStorage,setCurrentUser}) {
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const res = await axios.post("/users/login", user);
            setCurrentUser(res.data.username);
            myStorage.setItem('user', res.data.username);
            setShowLogin(false)
            setError(false);
        } catch (err) {
            setError(true);
        }
    };

    return (
        <div className='loginContainer'>
            <div className="logo">
                <FaMapMarkerAlt />
                ST Map
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='username' ref={usernameRef} />
                <input type="password" placeholder='password' ref={passwordRef} />
                <button className='loginBtn' type='submit'>Login</button>
                {error &&
                    <span className='failure'>Something went wrong!</span>
                }
                <GiCancel className='loginCancel' onClick={() => setShowLogin(false)} />
            </form>
        </div>
    )
}
