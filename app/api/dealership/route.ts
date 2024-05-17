import prismadb from "@/lib/prismadb"

import { auth } from "@clerk/nextjs/server";
import { create } from "domain";
import { Key } from "lucide-react";
import { NextResponse } from "next/server"


export async function POST(req: Request) {
  try {

    const body = await req.json()
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unautorized", { status: 401 })
    }

    const dealership = await prismadb.dealership.create({
      data: {
        ...body,
        userId,
        // Create images in image model
        image: {
          create:
            [...body.image]
        }
      }
    })

    return NextResponse.json(dealership)

  } catch (error) {
    console.log(`Error in POST /api/hotel/route.ts: ${error}`)
    return new NextResponse(`Internal Server Error`, { status: 500 })
  }

}