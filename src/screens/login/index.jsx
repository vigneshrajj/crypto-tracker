import React, { useState } from 'react';
import styles from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import Envelope from '../../assets/envelope.svg';
import Lock from '../../assets/lock.svg';

const Index = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const login = () => {
        if (email === 'test' && password === 'test') {
            localStorage.setItem('isAuth', 'authenticated');
            navigate('/list');
        } else {
            setError('Invalid Credentials!');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                <div className={styles.inputContainer}>
                    <span>
                        <img src={Envelope} alt='envelope' />
                    </span>
                    <input
                        type='email'
                        placeholder='Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <span>
                        <img src={Lock} alt='lock' />
                    </span>
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <button onClick={login}>Login</button>
            </div>
        </div>
    );
};

export default Index;
