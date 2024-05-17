import prismadb from "@/lib/prismadb"

import { auth } from "@clerk/nextjs/server";
import { create } from "domain";
import { Key } from "lucide-react";
import { NextResponse } from "next/server"


export async function POST(req: Request) {
  try {

    const body = await req.json()
    const { userId } = auth()

    const myImage = body.image[0]
    delete myImage.customId

    console.log(myImage)
    console.log('body my image ======================================')
    delete body.image

    // return

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 })
    }

    const dealership = await prismadb.dealership.create({
      data: {
        // remove image from body
        ...body,
        userId,
        //  how can i add all the images in the array to the image table
        // image: {
        //   create: {
        //     ...myImage
        //   }
        // }

        // image: {
        //   create: [
        //     { ...myImage }
        //   ]
        // }
        image: {
          create: {
            ...myImage
          }


        }


        // image: {
        //   create:
        //     [myImage]
        // }
        // image: {
        //   create: [
        //     { ...body.image[0] }
        //   ]


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