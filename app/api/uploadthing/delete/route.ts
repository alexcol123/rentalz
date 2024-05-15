
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi


export async function POST(req: Request) {
  const { userId } = auth()



  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  const { key } = await req.json()

  console.log(key)

  try {
    const res = await utapi.deleteFiles(key)

    return NextResponse.json(res)
  } catch (error) {
    console.log('error at uploadthing/delete', error)

    return NextResponse.json('Internal Server Error', { status: 500 })

  }

}