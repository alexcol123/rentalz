import prismadb from "@/lib/prismadb"

import { auth } from "@clerk/nextjs/server";
import { Key } from "lucide-react";
import { NextResponse } from "next/server"


export async function POST(req: Request) {
  try {

    const body = await req.json()
    const { userId } = auth()


    //     console.log(body)
delete body.image

    // return

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 })
    }

    const dealership = await prismadb.dealership.create({
      data: {
        // remove image from body
        ...body,
        userId

        // ...body,
        // userId,
        // image: {
        //   create: {
        //     data: body.image[0]
        //   }

        // }
      }
    })



    console.log('end======================================================================================================================')

    return NextResponse.json(dealership)

  } catch (error) {
    console.log(`Error in POST /api/hotel/route.ts: ${error}`)
    return new NextResponse(`Internal Server Error`, { status: 500 })
  }

}