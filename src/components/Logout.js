import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Logout.css'
import { useEffect, useState } from 'react'
import { logout } from '../API/functions'



const Logout = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        setUser(user)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
    }
    
  return (
    <button className='logout' onClick={handleLogout}>Kirjaudu ulos</button>
  )
}

export default Logout
