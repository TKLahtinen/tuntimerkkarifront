import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import '../styles/Login.css'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:3000/login', {
            "user":{
                "email": email,
                "password": password
            }
          });
            let data = response.data.status;
            console.log(data);
            localStorage.setItem('user',
                 JSON.stringify({
                    user_id: data.data.user.id,
                    name: data.data.user.name,
                    role: data.data.user.role,
                    token: data.token
                }));
            navigate('/home');
        } catch (error) {
          setError(true);
        }
    };

    useEffect(() => {
        setError(false);
    }
    , [login]);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/signup', {
                "user":{
                    "name": username,
                    "email": email,
                    "password": password
                }
            });
            let data = response.data.status;
            localStorage.setItem('user', JSON.stringify({
                user_id: data.data.id,
                name: data.data.name,
                role: data.data.role,
                token: data.token
            }));
            navigate('/home');
        }   catch (error) {
            setError(true);
            console.log(error);
        }
    };


  return (
    <div className='logboxContainer'>
        <div className='logbox'>
            <div className='logregSelector'>
                <div className='logbtn' style={{backgroundColor : login ? 'darkgray' : ''}} onClick={() => setLogin(true)}>Kirjautuminen</div>
                <div className='regbtn' style={{backgroundColor : !login ? 'darkgray' : ''}} onClick={() => setLogin(false)}>Rekisteröityminen</div>
            </div>
            {login ? 
            <form onSubmit={handleLogin}>
                <div className='credentials'>
                    <div className='inputContainer'>
                        <input type='email' placeholder='Sähköposti' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='inputContainer'>
                        <input type='password' placeholder='Salasana' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <div className='error'>Virheellinen käyttäjätunnus tai salasana</div>}
                    <button type='submit'>Kirjaudu</button>
                </div>
            </form>
            :
            <form onSubmit={handleSignup}>
                <div className='credentials'>
                    <div className='inputContainer'>
                        <input type='text' placeholder='Nimi' value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className='inputContainer'>
                        <input type='email' placeholder='Sähköposti' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='inputContainer'>
                        <input type='password' placeholder='Salasana' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <div className='error'>Jokin meni vikaan!</div>}
                    <button type='submit'>Rekisteröidy</button>
                </div>
            </form>
            }
        </div>
    </div>
  )
}

export default Login
