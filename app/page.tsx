"use client"

import { useState } from "react"

export default function Home() {

  const [url,setUrl] = useState("")
  const [result,setResult] = useState(null)

  async function handleDownload(){

    const res = await fetch("/api/download",{
      method:"POST",
      body:JSON.stringify({url})
    })

    const data = await res.json()

    setResult(data)
  }

  return (

    <main style={{padding:"40px",textAlign:"center"}}>

      <h1>DownloadAllinOne</h1>

      <p>
      Download videos from YouTube TikTok Instagram Facebook
      </p>

      <input
        style={{width:"400px",padding:"10px"}}
        placeholder="Paste video URL"
        onChange={(e)=>setUrl(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleDownload}>
        Download
      </button>

      {result && (
        <div>

          <a href={result.download}>
            Download Video
          </a>

        </div>
      )}

    </main>

  )
}
