import React, { useEffect, useRef } from 'react'
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function TextEditor() {
    const wrappperRef =  useRef();

    useEffect(() => {
        const editor = document.createElement("div");
        wrappperRef.current.append(editor);
        new Quill(editor, {theme: "snow"});

        return () => {
            wrappperRef.innerHTML=  ""
        }
    },[]);
    return <div id ="container" ref={wrappperRef}></div>
}
