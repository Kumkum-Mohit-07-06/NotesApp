import React, { useEffect, useState } from 'react'
import './favourite.css'
import DOMPurify from 'dompurify';

const favourite = () => {
  const [notes, setNotes] = useState([])
const [expand, setExpand] = useState('')
  

  useEffect(() => {
    fetch('https://notesapp-backend1.onrender.com/dashboard/favourite', {
      method: 'GET',
      credentials: 'include'
    }).then(res => {
      if (!res.ok) {
        throw new Error(`Network is not ok: ${res.status}`)
      }
      return res.json();
    }).then(data => {
      setNotes(data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    })
  }, [])

  
  const handleunmark=async (i)=>{
    const c=notes[i].content;
    const t=notes[i].title;
    const res=await fetch('https://notesapp-backend1.onrender.com/dashboard/favourite',{
      method:'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials:'include',
      body:JSON.stringify({c,t})
      })
      const data=await res.json();
      if(res.ok){
        alert(data.message)
        setNotes((prevNotes) => prevNotes.filter((_, idx) => idx !== i));

      }
    


  }

  return (
    <div className='b'>
      <div className='favMAIN'>
        {notes.map((dat, index) => {
          const cleanContent = DOMPurify.sanitize(dat.content);

          return (
            <div className='child' key={index}>
              <h3>{dat.title}</h3>
              {/* Use dangerouslySetInnerHTML to render the HTML */}
              <div className={`a ${expand === index? 'i' : ''}`} dangerouslySetInnerHTML={{ __html: cleanContent }} />
              <div className='icParent' style={{ display: "flex", background: "none" }}>
                <span className="fa-stack" onClick={() => handleunmark(index)}>
                  <i className="fas fa-star fa-stack-1x set" style={{color:'white'}}></i>
                  <i className="fas fa-slash fa-stack-1x set" style={{ color: "red" ,background:'transparent'}}></i>
                </span>
              </div>
            </div>
          )

        })}
      </div>
    </div>
  )
}

export default favourite