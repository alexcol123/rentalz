"use client"
import axios from 'axios'
import { any, custom, set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UploadButton } from "@/components/uploadthing";
import { Car, Dealership, Image as ImageTypeProps } from "@prisma/client"
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { UploadThingError } from "uploadthing/server";
import Image from "next/image";
import { Delete, Loader2, PencilLine, Plus, Trash, Trash2 } from "lucide-react";
import useLocation from '@/hooks/useLocation'
import { ICity, IState } from 'country-state-city'


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { title } from 'process'

type AddDealershipProps = {
  dealership: DealershipWithCars | null
}

export type DealershipWithCars = Dealership & {
  cars: Car[]
}


type ImageProps = {
  customId: string | undefined | null,
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

  const countries = getAllCountries()

  const { toast } = useToast()
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


    // if (dealership) {
    //   // update dealership
    // } else {
    //   //create hotel
    //   const resp = await axios.post('/api/dealership', values)


    //   // const resp =  axios.post('/api/dealership', values)

    //   console.log(resp)
    // }
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

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dealership Name:</FormLabel>

                    <FormDescription>
                      Provide your dealership name.
                    </FormDescription>

                    <FormControl>
                      <Input placeholder="Miami Sportcar rentals..." {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dealership Description :</FormLabel>

                    <FormDescription>
                      Provide a brief description of your  dealership.
                    </FormDescription>

                    <FormControl>
                      <Textarea placeholder="Dealership located in Miami Beach,  we rent exotic vehicles such as ferrari..." {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Choose Vehicles Types :</FormLabel>

                <FormDescription>
                  Choose types of vehicles that your dealership provides
                </FormDescription>

                <div className="grid grid-cols-2 gap-2 mt-2 border border-muted-foreground rounded-md  p-2  bg-background "  >

                  <FormField
                    control={form.control}
                    name="trucks"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end    space-x-3 ">

                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>

                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="motorcycles"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end    space-x-3 ">

                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>

                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <FormField
                    control={form.control}
                    name="usedCars"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end    space-x-3 ">

                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>

                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />



                  <FormField
                    control={form.control}
                    name="newCars"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end    space-x-3 ">

                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>

                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />



                  <FormField
                    control={form.control}
                    name="electricCars"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end    space-x-3 ">

                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>

                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>

                        <FormMessage />
                      </FormItem>
                    )}
                  />



                </div>

              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-3 w-full  ">
                    <FormLabel className="capitalize">
                      Upload an  {field.name}
                    </FormLabel>

                    <FormDescription>
                      Choose the main image for your dealership.
                    </FormDescription>

                    <FormControl>

                      {images
                        ? <div className="grid grid-cols-3 gap-2   ">

                          {images.map((image) => (
                            <div key={image.url} className="relative" >
                              <Image width={200} height={200} src={image.url} alt="dealership image" className="w-46 h-24 object-cover" />

                              <div className="bg-destructive/80 rounded-full p-1 absolute top-1 right-1 h-6 w-6 ">
                                <Button
                                  onClick={() => handleImageDelete(image)}
                                  type="button" className="h-4 w-4" size='icon'>
                                  {imageIsDeleting ? <Loader2 className='animate-spin' /> : <Trash2 />}
                                </Button>
                              </div>
                            </div>
                          ))}


                        </div>
                        :

                        <div className="w-ful flex flex-col  items-center max-w-[400px]  p-12 border-2 border-dashed border-primary  rounded mt-4 " >
                          <UploadButton
                            // className="mt-4 ut-button:bg-red-500 ut-button:ut-readying:bg-red-500/50"

                            appearance={{
                              button:
                                "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-r-none bg-destructive bg-none after:bg-orange-400",
                              container: "w-max flex-row rounded-md border-cyan-300 bg-slate-800",
                              allowedContent:
                                "flex h-8 flex-col items-center justify-center px-2 text-white",
                            }}

                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              // Do something with the response
                              console.log('Files: ================================================================================')

                              console.log(res[0])

                              console.log('---------------------------------')

                              console.log(res)

                              console.log('Files End: ================================================================================')

                              if (images === undefined) {
                                setimages(res)
                              } else {
                                setimages([images, ...res])
                              }


                              toast({
                                variant: 'success',
                                description: "🚀 Upload Completed",
                              })
                            }}
                            onUploadError={(error: Error) => {
                              // Do something with the error.
                              console.log(error.message)

                              if (error.message === 'Invalid config: FileCountMismatch') {
                                toast({
                                  variant: 'destructive',
                                  description: `Upload maximun of 8 images at a time, Each Image must be a maximun of 8MB in size`,
                                })
                              }
                              else {
                                toast({
                                  variant: 'destructive',
                                  description: `ERROR! ${error.message}`,
                                })
                              }
                            }}
                          />
                        </div>
                      }
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>


            <div className="flex-1 flex flex-col gap-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Country</FormLabel>

                      <FormDescription>
                        In wich country is your dealership located
                      </FormDescription>

                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}

                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>

                          {countries.map((country) => {

                            return <SelectItem key={country.isoCode} value={country.isoCode}>
                              {country.name} {country.flag}
                            </SelectItem>
                          })}

                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />



                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select State</FormLabel>

                      <FormDescription>
                        In wich state is your dealership located
                      </FormDescription>

                      <Select
                        disabled={isLoading || !states.length}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}

                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a State" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>

                          {states.map((state) => {

                            return <SelectItem key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </SelectItem>
                          })}

                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />



                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select City</FormLabel>

                      <FormDescription>
                        In wich city is your dealership located
                      </FormDescription>

                      <Select
                        disabled={isLoading || !cities.length}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}

                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a City" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>

                          {cities.map((city) => {

                            return <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          })}

                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>


              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location  Description :</FormLabel>

                    <FormDescription>
                      Provide a brief description of your  dealership location via the highway or main roads.
                    </FormDescription>

                    <FormControl>
                      <Textarea placeholder="Located near exit 85 of Interstate 95 in Paramus, New Jersey,  Its  on the Left of the HomeDepot store" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />


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

