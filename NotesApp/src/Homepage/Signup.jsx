import React from 'react'
import { useRef, useState } from 'react'
import './Signup.css'
import { Link } from 'react-router-dom'

const Signup = () => {
    const ref1 = useRef(null)
    const ref2 = useRef(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors , setErrors] = useState("")

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
        setErrors("")
        if(email.length > 0 && password.length > 0){
            const response = await fetch('http://localhost:5000/signup', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const data= await response.json();
              if(response.ok) {
          alert(data.message); 
          setErrors("");   
          window.location.href='/login';     
        }
        
        }else{
            setErrors("Email and Password cannot be empty")
        }
        
    }

    return (
        <>

            <div className="fullPage">
                <div className="logosign">
                    <img src="https://i.ibb.co/4ZbnQyRR/Your-Notes-App-removebg-preview-1.png" alt="Logo" />
                    <h2 >Sign up from here!</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="inp">
                        <i className="fa-solid fa-envelope"></i><input type="email" name="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="inp">
                        <i className="fa-solid fa-lock"></i><input type="password" name="password" className="mk" ref={ref2} placeholder="Password" onChange={e => setPassword(e.target.value)} /><i className="fa-solid fa-eye-slash mh" ref={ref1} onClick={handleEye}></i>
                    </div>
                    <button type="submit">Sign up</button>
                {errors && <p style={{ color: "red" , margin:"10px"}}>{errors}</p>}
                </form>
                <p>Already have an account?</p><Link className="link" to="/login">log in</Link>
            </div>
        </>
    )
}

export default Signup