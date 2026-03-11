import { NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://downloader-server-production-3252.up.railway.app"

export async function POST(req: Request) {
  const { url } = await req.json()

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 })
  }

  try {
    const response = await fetch(`${BACKEND_URL}/info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: err.error || "Backend error" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Backend fetch error:", err)
    return NextResponse.json(
      { error: "Impossible de contacter le serveur" },
      { status: 502 }
    )
  }
}
