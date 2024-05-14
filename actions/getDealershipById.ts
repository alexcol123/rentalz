import prismadb from "@/lib/prismadb"

export const getDealershipById = async (dealershipId: string) => {
  try {
    const dealership = await prismadb.dealership.findUnique({
      where: {
        id: dealershipId
      }, include: {
        cars: true
      }
    })

    if (!dealership) {
      return null
    }


    return dealership

  } catch (error: any) {
    // throw new Error("Id not found")
    console.log('****  Error in  Actions getDealershipById ', error)
    return null
  }
}