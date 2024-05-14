import { getDealershipById } from "@/actions/getDealershipById"
import AddDealershipForm from "@/components/dealership/AddDealershipForm"
import { auth } from "@clerk/nextjs/server"

type DealershipPageProps = {
  params: {
    dealershipId: string
  }
}


const Dealership = async ({ params }: DealershipPageProps) => {


  const dealership = await getDealershipById(params.dealershipId)
  const { userId } = auth()


  // Add route to middleware so that if users are not sign in they are not allowed acces here

  if (dealership && dealership.userId !== userId) {
    return <div> Access Denied</div>
  }


  return (
    <div className="">

      <AddDealershipForm dealership={dealership} />
    </div>
  )
}
export default Dealership