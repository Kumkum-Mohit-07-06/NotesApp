import React, { useRef, useEffect, useState } from 'react'
import "./save.css"
import DOMPurify from 'dompurify';

const save = () => {
    const ref = useRef(null)
    const [notes, setNotes] = useState([])
    const [expand, setExpand] = useState('')

    useEffect(() => {
        fetch('http://localhost:5000/dashboard/save', { credentials: 'include' }).then(response => {
            if (!response.ok) {
                throw new Error(`Network is not ok: ${response.status}`)
            }
            return response.json();
        }
        ).then(data => {
            
            setNotes(data);
        }).catch(error => {
            console.error('Error fetching data:', error);
        })
    }, [])

    const handleDel = async (i) => {
        
        let c = notes[i].content;
        let t = notes[i].title;
        const res = await fetch('http://localhost:5000/dashboard/save', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ c, t, action: 'delete' })
        })
        const data = await res.json()
        if (res.ok) {
            alert(data.message);
            setNotes((prevNotes) => prevNotes.filter((_, idx) => idx !== i));

        }
        else {
           
        }

    }

    const handleStar = async (i) => {
        const res = await fetch('http://localhost:5000/dashboard/save', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ c: notes[i].content, t: notes[i].title, action: 'favourite' })
        })
        const data = await res.json()
        if (res.ok) {
            // console.log(data.message);
        }
        else {
            // console.log(data.message)
        }
    }
    const handleEdit = async (i) => {
        let c = notes[i].content;
        let t = notes[i].title;
        const res = await fetch('http://localhost:5000/dashboard/save', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ c, t, action: "edit" })
        })
        if (res.ok) {
            // setNotes((prevNotes) => prevNotes.filter((_, idx) => idx !== i));
            window.location.href = "/dashboard/create"
        }


    }
    const handleSize = (i) => {
       setExpand(expand === i? null : i)        
    }
        return (
        <><div className='b'>
            <div className="parent" >
                {notes.map((dat, index) => {
                    const cleanContent = DOMPurify.sanitize(dat.content);

                    return (
                        <div  className={`child ${expand === index? 'size' : ''}`} onClick={()=> handleSize(index)} key={index}>
                            <h3 style={{textAlign:"center"}}>{dat.title}</h3>
                            {/* Use dangerouslySetInnerHTML to render the HTML */}
                            <div className={`a ${expand === index? 'i' : ''}`} dangerouslySetInnerHTML={{ __html: cleanContent }} />
                            <div ref={ref} className='icParent' >
                                <i className='fas fa-star set star' onClick={() => handleStar(index)}></i>
                                <i className="fa-solid fa-trash-can del set" onClick={() => handleDel(index)}></i>
                                <i className="fas fa-edit set edit" onClick={() => handleEdit(index)}></i>
                            </div>
                        </div>
                    )

                })}
            </div>
        </div>
        </>
    )
}

export default save