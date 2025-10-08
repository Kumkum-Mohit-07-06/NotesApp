import React from 'react'
import axios from 'axios';
import { useRef, useState } from 'react'
import './Signup.css'
import { Link } from 'react-router-dom'

const Signup = () => {
    const ref1 = useRef(null)
    const ref2 = useRef(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors , setErrors] = useState("")
    const [otpSent , setOtpSent] = useState(false)
    const [otpVerified , setOtpVerified] = useState(false)
    const [otp , setOtp] = useState('');

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
            setErrors("Email cannot be empty")
        }
        
    }

    const sendOtp = async ()=>{
        try{
            const res = await axios.post('http://localhost:5000/send-otp', {email});
            setOtpSent(true);
            setErrors(res.data.message);
        } catch(err){
            setErrors(err.response?.data?.message || "Error sending OTP");
        }
    };

    const verifyOtp = async ()=>{
        try{
            const res = await axios.post('http://localhost:5000/verify-otp', {email, otp});
            setOtpVerified(true);
            setErrors(res.data.message);
        } catch(err){
            setErrors(err.response?.data?.message || "Error verifying OTP ");
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
                        <i className="fa-solid fa-envelope"></i><input type="email" name="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} disabled={otpSent}/>
                    </div>

                    {!otpSent ? (
                        <button onClick={sendOtp}>Send OTP</button>
                    ) : !otpVerified ? (
                        <>
                        <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} style={{color:"white" }} />
                        <button onClick={verifyOtp}>Verify OTP</button>
                        </>
                    ) : (
                        <>
                        <div className="inp">
                        <i className="fa-solid fa-lock"></i><input type="password" name="password" className="mk" ref={ref2} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><i className="fa-solid fa-eye-slash mh" ref={ref1} onClick={handleEye}></i>
                    </div>
                    <button type="submit">Sign up</button>
                        </>
                    )}

                    
                {errors && <p style={{ color: "red" , margin:"10px"}}>{errors}</p>}
                </form>
                <p>Already have an account?</p><Link className="link" to="/login">log in</Link>
            </div>
        </>
    )
}

export default Signup