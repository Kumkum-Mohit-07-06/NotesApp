import React, { useReducer } from 'react'
import "./Create.css"
import Save from './save'
import { useEffect, useRef, useState } from 'react';
const Create = () => {
  const [color, setColor] = useState('white');
  const [title, setTitle] = useState('')
  const editorRef = useRef(null);
  const ref1 = useRef(null);
 
  // const handleInp = (e) =>{
  //     setText(e.target.innerText)
  //     console.log(text)
  // }
  const handleText = (e) => {
    // const val = e.target.innerText;
    // setText(val)
  }

  const applyColor = (selectedColor) => {
    const editor = editorRef.current;

    // Focus the editor first
    // editor.focus();

    // Ensure selection exists
    const selection = window.getSelection();
    const range = document.createRange();

    if (!selection.rangeCount) {
      // If there's no range, put the cursor at the end of the editor
      range.selectNodeContents(editor);
      range.collapse(false); // Cursor at end
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Apply the selected text color to future typing
    document.execCommand('styleWithCSS', false, true); // Enables inline CSS
    document.execCommand('foreColor', false, selectedColor);
  };
  //  let t = editorRef.current.InnerHTML;
  //  console.log(t)
  const handlesave = async (e) => {
    e.preventDefault()
    const rawHTML = editorRef.current?.innerHTML;

    // if (text.trim().length === 0) {
    //   alert("Please write something before saving.");
    //   return;
    // } 




    const response = await fetch('http://localhost:5000/dashboard/create', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify({ text: rawHTML, title, action: "create" })
    })

    // const data=await response.json();
    //   if(response.ok) {
    //   alert(data.message);
    //   editorRef.current.innerText = ""; // ✅ Clear the contentEditable div
    // }
    editorRef.current.innerHTML = " "
    ref1.current.value =''
  }


  useEffect(() => {

    fetch('http://localhost:5000/dashboard/create', {
      method: "GET",
      credentials: 'include',
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Network is not ok: ${response.status}`)
      }
      return response.json();
    }
    ).then(data => {
      if (data.length > 0) {
        setTitle(data[0].title)
        editorRef.current.innerHTML = data[0].content;
      }
         fetch('https://notesapp-backend1.onrender.com/dashboard/save', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({c: data[0].content, t: data[0].title , action: "delete" })
            });
        
        
        }).then(e=>{
           fetch("https://notesapp-backend1.onrender.com/dashboard/save", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({ action: "clearEdit" })
           
        })}).catch(err => {

        })

    

  }, [])



  return (

    <>
   
      <h2 className="h">Write Your Notes Here</h2>
      <div className='main' >
        <input type="text" ref={ref1} name="title" id="intitle" onChange={e => setTitle(e.target.value)} placeholder='Enter Title' style={{ paddingLeft: "20px", borderRadius: "10px", margin: "10px 0px", border: "solid 1px white" }} />
        <div onInput={handleText} ref={editorRef} id="edit" contentEditable  className='divinp'>
        </div>
        <br />

        <div style={{ display: 'flex', gap: '20px', alignItems: "center", justifyContent: "center" }}>
          <button onClick={handlesave} className='save'>Save</button>
          <button className="colorcls c1" onClick={() => applyColor('rgb(213, 166, 26)')}></button>
          <button className="colorcls c2" onClick={() => applyColor('rgb(17, 247, 17)')}></button>
          <button className="colorcls c3" onClick={() => applyColor('rgb(0, 191, 255)')}></button>
        </div>



      </div>

    </>
  )
}

export default Create