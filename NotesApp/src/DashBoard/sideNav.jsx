import React from 'react'
import "./sideNav.css"
import { Link } from 'react-router-dom'
const sideNav = () => {
    const handledash = () => {
        let sideNav = document.querySelector(".sideNav");
        sideNav.classList.remove('hidedash')
        sideNav.classList.toggle('showdash')
       
    }
    const handlecut = () => {
        let sideNav = document.querySelector(".sideNav");
        sideNav.classList.toggle('hidedash')
         sideNav.classList.remove('showdash')
    }
    return (
        <>
            <i className="fa-solid fa-bars m" onClick={handledash}></i>
            <div className="sideNav">
            <i className="fas fa-xmark x" onClick={handlecut}></i>
                <div className="logol">
                    <img src="https://i.ibb.co/4ZbnQyRR/Your-Notes-App-removebg-preview-1.png" alt="Logo" />
                </div>

                <ul className='menu '>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/dashboard/create">
                            <div className='liDiv'><i className="fa fa-plus-circle b"></i>Create New</div>
                        </Link>
                    </li>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/dashboard/save">
                            <div className='liDiv'><i className="fa-solid fa-save b"></i>Saved Notes</div>
                        </Link>
                    </li>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/dashboard/favourite">
                            <div className='liDiv'><i className="fa-solid fa-star b"></i>Favourite Notes</div>
                        </Link>
                    </li>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/dashboard/profile">
                            <div className='liDiv'><i className="fa-solid fa-user b"></i>Your Profile</div>
                        </Link>
                    </li>

                </ul>
                <ul className='HomeLink'>
                    <li>
                        <Link style={{ textDecoration: "none" }} to="/">
                            <div className="liDiv"><i className="fa-solid fa-house b"></i>Return To Home</div>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default sideNav