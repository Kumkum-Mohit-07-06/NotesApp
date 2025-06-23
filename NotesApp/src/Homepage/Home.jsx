import React , {useRef, useState} from 'react'
import { Link } from 'react-router-dom'
import {useInView}  from "react-intersection-observer";
import { HashLink } from 'react-router-hash-link';
import "./Home.css"
const Navbar = () => {
  const [feedback, setFeedback] = useState('')
  const [emailf, setEmailf] = useState('')
  const {ref, inView} = useInView({triggerOnce:true, threshold:0.3})
  const { ref: leftRef, inView: leftInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: rightRef, inView: rightInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const handleFeedback = async ()=>{
      const res= await fetch('https://notesapp-backend1.onrender.com/feedback',{
        method:'POST',
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify({e:emailf, f:feedback} )
      })
      const data=await res.json();
      if(!res.ok){
        console.log(data.message)
      }
  }
  const visiblenav = () => {
    let navul = document.querySelector(".navul");
    navul.classList.toggle('show')

 const texts = ['text3', 'text2', 'text1'];
  texts.forEach((id, index) => {
    setTimeout(() => {
      document.getElementById(id).classList.toggle('sh');
    }, index * 500); // 500ms between each
  });  }
  return (
    <>
      <nav>
        <div className="logo m2">
          <img src="https://i.ibb.co/4ZbnQyRR/Your-Notes-App-removebg-preview-1.png" alt="Logo" />
        </div>
        <ul className='navul m2'>
          <li><Link id="text3" className='text-block' style={{ textDecoration: "none" }} to="/">Home</Link></li>
          <li><HashLink id='text2' className='text-block' style={{ textDecoration: "none" }} smooth to="#aboutus">About Us</HashLink></li>
          <li><HashLink id='text1' className='text-block' style={{ textDecoration: "none" }} to="#feedback">Feedback us</HashLink></li>
        </ul>
          <i className="fa-solid fa-bars ham" onClick={visiblenav}></i>
        <div className="logBtn m2">
          <Link className="btnLink" to="/signup"> Sign Up</Link>
          <Link className="btnLink" to="/login">Log in</Link>
        </div>
      </nav>

      <div className="mainPagePhoto" >
        <div className="img_sec">
          <img src="https://cdn.flexcil.com/wp-content/uploads/2022/08/18044020/2022-08-18-134124-1080x675.png" alt="Img" />
        </div>
        <div className="secCon">
          <h1>Start your note journey with us</h1>
          <div className="logBtn m1">
            <Link className="btnLink" to="/signup">Sign Up</Link>
            <Link className="btnLink" to="/login">Log in</Link>
          </div>
        </div>


      </div>
      <br/><br/>
      <div id="aboutus" ref={ref}>
        <div className={`logoImg ${inView? 'visible-left' : 'hidden-left'}`}>
          <img src="https://i.ibb.co/4ZbnQyRR/Your-Notes-App-removebg-preview-1.png" alt="Logo" />
        </div>
        <div className={`aboutcontent  ${inView? 'visible-right' : 'hidden-right'}`}>
          <p>About us</p>
          Welcome to Your Notes App your simple, secure, and smart digital notebook.
          We believe that ideas are powerful, and capturing them should be effortless.
          Our app is designed to help you write, save, and organize your thoughts-whether it's a quick reminder,<br/> a class note, a creative draft, or <br/>your daily journal. <br/>With an intuitive interface, cloud-backed storage, and customizable features, your notes are always accessible, editable, and safe.
        </div>
      </div>
    <br/><br/><br/> <br/><br/>
      <div className='images'>
        <div ref={leftRef} className={`interface br ${leftInView? 'rotate-left' : ''}`} >
          <img src='src/assets/Screenshot 2025-06-20 035001.png' alt="interface" />
        </div>
        <div ref={rightRef} className={`interface ${rightInView? 'rotate-right' : ''}`}>
          <img src='src/assets/Screenshot 2025-06-20 040158.png' alt="interface" />
        </div>
      
      </div>
      <br/><br/><br/>
      <div id="feedback">
        <form className='form' onSubmit={handleFeedback}>
          <input type='email' placeholder='Email' onChange={(e)=> setEmailf(e.target.value)}/><br/>
          <textarea placeholder='Enter your Feedback here' rows='10' cols='50' onChange={(e)=> setFeedback(e.target.value)}></textarea>
          <button type='submit' className='subFeed' >Submit</button>
        </form>
      </div>
      <br/><br/>
      <footer style={{display:'flex', justifyContent:'center', alignItems:'center', textAlign:'center', backgroundColor:'black', fontSize:'14px', height:'40px'}}>
        &copy; 2025 Your Notes App. All Rights Reserved.
      </footer>
    </>
  )
}

export default Navbar