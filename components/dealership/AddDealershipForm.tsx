"use client"
import axios from 'axios'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Car, Dealership, } from "@prisma/client"
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"

import {
  Form,
  FormDescription,
  FormLabel,
} from "@/components/ui/form"


import { useToast } from "@/components/ui/use-toast"
import { Loader2, PencilLine, Plus, } from "lucide-react";
import useLocation from '@/hooks/useLocation'
import { ICity, IState } from 'country-state-city'

import MyFormInput from '../form-parts/MyFormInput'
import MyFormTextArea from '../form-parts/MyFormTextArea'
import MyFormSelect from '../form-parts/MyFormSelect'
import MyFormCheckbox from '../form-parts/MyFormCheckbox'
import MyFormImageUpload from '../form-parts/MyFormImageUpload'

type AddDealershipProps = {
  dealership: DealershipWithCars | null
}

export type DealershipWithCars = Dealership & {
  cars: Car[]
}

export type ImageProps = {
  customId: string | null,
  key: string;
  name: string;
  serverData: {
    uploadedBy: string;
  };
  type: string;
  size: number;
  url: string;
};


const formSchema = z.object({
  title: z.string().min(3, {
    message: 'title must be atlest 2 charactes long'
  }),
  description: z.string().min(3, {
    message: 'description must be atlest 2 charactes long'
  }),
  image: z.object({
    name: z.string().min(1),
    size: z.number().int(),
    key: z.string().min(1),
    serverData: z.object({
      uploadedBy: z.string().min(1),
    }),
    url: z.string().url(),
    customId: z.union([z.string().nullable(), z.null()]),
    type: z.string().min(1)
  }).array().nonempty(),


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

  const { getAllCountries, getCountyStates, getStateCities } = useLocation()
  const { toast } = useToast()
  const countries = getAllCountries()

  const [images, setimages] = useState<ImageProps[] | undefined>(undefined)
  const [imageIsDeleting, setimageIsDeleting] = useState(false)
  const [states, setstates] = useState<IState[]>([])
  const [cities, setcities] = useState<ICity[]>([])
  const [isLoading, setisLoading] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: dealership || {
      title: '',
      description: '',
      image: undefined,
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

    // console.log(values)
    setisLoading(true)

    axios.post('/api/dealership', values).then((res) => {
      console.log(res)
      setisLoading(false)
      toast({
        variant: 'success',
        description: "🥳 Dealership Created",
      })
    })
  }

  const handleImageDelete = async (image: ImageProps) => {
    console.log(image)
    setimageIsDeleting(true)
    try {
      const key = image.key
      const deletedImage = await axios.post(`/api/uploadthing/delete`, { key })
      console.log(deletedImage)
      if (deletedImage.statusText === 'OK') {
        toast({
          variant: 'success',
          description: "🥳 Image Deleted",
        })
      }

      if (images === undefined) {
        setimages(undefined)
      } else {
        let updatedImageList = images.filter((image) => image.key !== key)
        setimages(updatedImageList)
      }

    } catch (error) {
      toast({
        variant: 'destructive',
        description: "🚀 Error Deleting Image , try again",
      })
    } finally {
      setimageIsDeleting(false)
    }
  }

  useEffect(() => {
    if (images === undefined || images === null) return
    form.setValue('image', images as any, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images])


  useEffect(() => {
    const selectedCountry = form.watch('country')
    const countryStates = getCountyStates(selectedCountry)
    if (countryStates) {
      setstates(countryStates)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('country')])

  useEffect(() => {
    const selectedCountry = form.watch('country')
    const selectedState = form.watch('state')
    const stateCities = getStateCities(selectedCountry, selectedState)

    if (stateCities) {
      setcities(stateCities)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('country'), form.watch('state')])

  return (
    <div>
      <Form  {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6  border border-muted-foreground p-4 rounded-md  bg-muted">

          <h3 className="text-lg font-semibold">{dealership ? 'Update Your Dealership' : 'Describe Your Dealership'}</h3>
          <div className="flex flex-col md:flex-row gap-6">

            <div className="flex-1 flex flex-col gap-6">

              <MyFormInput name={'title'} myFormLabel={'Dealership Name:'} myFormDescription={'Provide your dealership name.'} myFormPlaceholder={'Miami Sportcar rentals...'} formControl={form.control} />

              <MyFormTextArea name={'description'} myFormLabel={'Dealership Description:'} myFormDescription={'Provide a brief description of your dealership.'} myFormPlaceholder={'Dealership located in Miami Beach,  we rent exotic vehicles such as ferrari...'} formControl={form.control} />

              <div>
                <FormLabel>Choose Vehicles Types :</FormLabel>

                <FormDescription>
                  Choose types of vehicles that your dealership provides
                </FormDescription>

                <div className="grid grid-cols-2 gap-2 mt-2 border border-muted-foreground rounded-md  p-2  bg-background "  >
                  <MyFormCheckbox name={'trucks'} formControl={form.control} />
                  <MyFormCheckbox name={'motorcycles'} formControl={form.control} />
                  <MyFormCheckbox name={'usedCars'} formControl={form.control} />
                  <MyFormCheckbox name={'newCars'} formControl={form.control} />
                  <MyFormCheckbox name={'electricCars'} formControl={form.control} />
                </div>
              </div>


              {/* Image Upload or Images list */}

              <MyFormImageUpload images={images}
                // create types for setimages and handleImageDelete
                setimages={setimages} formControl={form.control} name={'image'} imageIsDeleting={imageIsDeleting} handleImageDelete={handleImageDelete} />

            </div>

            <div className="flex-1 flex flex-col gap-6">

              {/* Selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <MyFormSelect name={'country'} myFormLabel={'Select Country'} myFormDescription={'Select the country where your dealership is located.'} myFormPlaceholder={'United States'} formControl={form.control} isLoading={isLoading} dataToMap={countries} />

                <MyFormSelect name={'state'} myFormLabel={'Select State'} myFormDescription={'Select the state where your dealership is located.'} myFormPlaceholder={'Select State'} formControl={form.control} isLoading={isLoading} dataToMap={states} />

                <MyFormSelect name={'city'} myFormLabel={'Select City'} myFormDescription={'Select the city where your dealership is located.'} myFormPlaceholder={'Select City'} formControl={form.control} isLoading={isLoading} dataToMap={cities} />
              </div>

              <MyFormTextArea name={'locationDescription'} myFormLabel={'Location  Description :'} myFormDescription={' Provide a brief description of your  dealership location via the highway or main roads.'} myFormPlaceholder={'Located near exit 85 of Interstate 95 in Paramus, New Jersey,  Its  on the Left of the HomeDepot store...'} formControl={form.control} />

              <div className="flex justify-between gap-2 flex-wrap ">
                {dealership
                  ? <>
                    <Button disabled={isLoading}>
                      {isLoading ? <><Loader2 className='mr-2' /> Updating</> : <><PencilLine className='mr-2' /> Update Dealership</>}
                    </Button>
                  </>
                  : <>
                    <Button>
                      {isLoading ? <><Loader2 className='mr-2' /> Creating</> : <><Plus className='mr-2' /> Create Dealership</>}
                    </Button>
                  </>
                }
              </div>
            </div>
          </div>

        </form>
      </Form>
    </div>
  )
}
export default AddDealershipForm
