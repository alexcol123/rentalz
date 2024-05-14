"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Car, Dealership } from "@prisma/client"


type AddDealershipProps = {
  dealership: DealershipWithCars | null
}

export type DealershipWithCars = Dealership & {
  cars: Car[]
}


const formSchema = z.object({

  title: z.string().min(3, {
    message: 'title must be atlest 2 charactes long'
  }),
  description: z.string().min(3, {
    message: 'description must be atlest 2 charactes long'
  }),
  image: z.string().min(1, {
    message: 'image is required'
  }),
  country: z.string().min(1, {
    message: 'country is required'
  }),
  state: z.string().optional(),
  city: z.string().optional(),
  locationDescription: z.string().min(3, {
    message: 'locationDescription must be atlest 2 charactes long'
  }),
  trucks: z.boolean().optional(),
  motorcycles: z.boolean().optional(),
  usedCars: z.boolean().optional(),
  newCars: z.boolean().optional(),
  electricCars: z.boolean().optional(),
})


const AddDealershipForm = ({ dealership }: AddDealershipProps) => {


  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      country: '',
      state: '',
      city: '',
      locationDescription: '',
      trucks: false,
      motorcycles: false,
      usedCars: false,
      newCars: false,
      electricCars: false,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <div className="">AddDealershipForm</div>
  )
}
export default AddDealershipForm