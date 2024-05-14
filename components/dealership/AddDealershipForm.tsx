'use client'

import { Car, Dealership } from "@prisma/client"

type AddDealershipProps = {
  dealership: DealershipWithCars | null
}

export type DealershipWithCars = Dealership & {
  cars: Car[]
}

const AddDealershipForm = ({ dealership }: AddDealershipProps) => {
  return (
    <div className="">AddDealershipForm</div>
  )
}
export default AddDealershipForm