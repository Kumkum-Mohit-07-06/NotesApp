import React, { useState, useEffect } from 'react'
import "./profile.css"
const profile = () => {
  const [image, setImage] = useState(null)
  const [file, setFile] = useState(null)
  const [emailu, setEmailu] = useState('')

  const handleImage = async (e) => {
    e.preventDefault()
    const selfile = e.target.files[0]

    if (selfile) {
      setFile(selfile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(selfile);
    }

    const formdata = new FormData()
    formdata.append('profile', selfile)

    const res = await fetch("http://localhost:5000/dashboard/profile",
      {
        method: "POST",
        credentials: "include",
        body: formdata,
      }
    )
    const data = await res.json()
    if (!res.ok) {
     
    } else {
     
      const imageURL = `http://localhost:5000/profile-image/${data.file}`;
      setImage(imageURL);
      // document.getElementById('profile-upload').value = null;
    }
  }


  useEffect(() => {
    fetch('http://localhost:5000/dashboard/profile', {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.profilePic) {
          setImage(`http://localhost:5000/profile-image/${data.profilePic}`);
        }
        setEmailu(data.emailUser)
      })
      .catch((err) => {
        console.error('Failed to load profile image:', err);
      });
  }, []);

  async function handleLogout() {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This cannot be undone!');
    if (!confirmDelete) return;
    const res = await fetch("http://localhost:5000/logout",
      {
        method: "POST",
        credentials: "include",
      }
    )
    const data = await res.json();
    setEmailu(null)
    setImage(null)
    window.location.href = "/"
  }

  return (
    <div className='proMain'>
      <h1 className='bh1'>Your Profile</h1>
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <input type="file" id="profile-upload" accept="image/*" hidden onChange={handleImage} />
        <label htmlFor="profile-upload" className="profile-label">
          <img src={image || "data:image/jpeg;base64,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"} alt="Profile" id="profile-pic" />
          {/* <button onClick={HandleUpload} className="overlay">Upload</button> */}
        </label>
      </form>
      <div className='infoBox' style={{ display: "flex", flexDirection: "column" }}>
        {/* <span  className='infoText'><i className="fas fa-user l"></i> Kumkum soni</span> */}
        <span className='infoText'><i className="fas fa-envelope l"></i> {emailu}</span>
      </div>
      <div className="logout">
        <button className="logBtn" onClick={handleLogout}><i className="fas fa-right-from-bracket l"></i>Log out</button>
      </div>
    </div>
  )
}

export default profile