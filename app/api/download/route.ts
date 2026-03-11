import { NextResponse } from "next/server"

export async function POST(req:Request){

  const {url} = await req.json()

  try{

    const response = await fetch(
      "https://noembed.com/embed?url="+url
    )

    const data = await response.json()

    return NextResponse.json({
      download:url,
      title:data.title
    })

  }catch{

    return NextResponse.json({
      error:"Video not supported"
    })

  }

}
