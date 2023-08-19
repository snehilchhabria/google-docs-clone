import React, { useCallback, useEffect, useState } from 'react'
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Socket, io } from 'socket.io-client';


const TOOLBAR_OPTIONS = [
    [{header : [1, 2, 3, 4, 5, 6, false] }],
    [{font : [] }],
    [{ list : "ordered"}, {list: "bullet"}],
    ["bold", "italic", "underline"],
    [{color: []}, {background: []}],
    [{ script: "sub"}, {script: "super" }],
    [{align: []}],
    ["image", "blockquote", "code-block"],
    ["clean"],
]


export default function TextEditor() {
    const [socket, setSocket] = useState();
    const[quill, setQuill] = useState();

    useEffect( () => {
       const s = io("http://localhost:3001") // connecting with the server
       setSocket(s);

       return () => {
        s.disconnect(); //disconnecting w the server
       }
    }, [])

    useEffect(() => {
        if (socket == null || quill == null) return;
      
        // 1. Define a handler function to update the Quill editor
        const handler = (delta) => {
          quill.updateContents(delta); // Apply the incoming changes to the Quill editor
        };
      
        // 2. Attach the handler function to the 'receive-changes' event from the server
        socket.on('receive-changes', handler);
      
        // 3. Clean up: Detach the handler when the component is unmounted
        return () => {
          socket.off('receive-changes', handler); // Detach the handler to avoid memory leaks
        };
      }, [socket, quill]);
    useEffect(() => {
        if (socket == null || quill == null) return;
      
        // 1. Define a handler function to send changes to the server
        const handler = (delta, oldDelta, source) => {
          if (source !== 'user') return; // Ignore changes not initiated by the user
          socket.emit("send-changes", delta); // Send the user's changes to the server
        };

        // 2. Attach the handler function to the 'text-change' event of the Quill editor
        quill.on('text-change', handler);
      
        // 3. Clean up: Detach the handler when the component is unmounted
        return () => {
          quill.off('text-change', handler); // Detach the handler to avoid memory leaks
        };
      }, [socket, quill]);
      

    const wrapperRef = useCallback((wrapper) => {
        if(wrapper == null) return
        
        wrapper.innerHTML=""
        const editor  = document.createElement("div")
        wrapper.append(editor)
        
        const q = new Quill(editor, {theme: "snow", modules : {toolbar : TOOLBAR_OPTIONS } })
        setQuill(q)
    },[]);
    return <div className ="container" ref={wrapperRef}></div>
}
