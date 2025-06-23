import React from 'react'
import { useRef, useState } from 'react'
import './login.css'


const login = () => {
  const ref1 = useRef(null)
  const ref2 = useRef(null)
    const [error, setError] = useState("");

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEye = () => {
    if (ref2.current.type === "password") {
      ref2.current.type = "text"
      ref1.current.classList.remove('fa-eye-slash');
      ref1.current.classList.add('fa-eye');
    }
    else {
      ref2.current.type = "password"
      ref1.current.classList.add('fa-eye-slash');
      ref1.current.classList.remove('fa-eye');
    }


  }

  const handleSubmit = async (e) => {
    e.preventDefault();

      if(email.length > 0 && password.length > 0){
        const res = await fetch('https://notesapp-backend1.onrender.com/login', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({ email, password })})
         const data = await res.json();
  
        if (!res.ok) {
          // Error from backend — show message or default
          setError(data.message || "Login failed");
        } else {
           window.location.href = '/dashboard';
          alert(data.message); 
          setError("");        
        }
      
      }else{
        setError("Email and Password cannot be empty")
      }


  }

  return (
    <>

      <div className="fullPage">
        <div className="logologin">
          <img src="https://i.ibb.co/4ZbnQyRR/Your-Notes-App-removebg-preview-1.png" alt="Logo" />
          <h2 >Login from here!</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inp">
            <i className="fa-solid fa-envelope"></i><input type="email" name="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="inp">
            <i className="fa-solid fa-lock"></i><input type="password" name="password" className="mk" ref={ref2} placeholder="Password" onChange={e => setPassword(e.target.value)} /><i className="fa-solid fa-eye-slash mh" ref={ref1} onClick={handleEye}></i>
          </div>
          <button type="submit">Log in</button>
          {error && <p style={{ color: "red" , margin:"10px"}}>{error}</p>}
        </form>
      </div>
    </>
  )
}

export default login