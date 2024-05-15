"use client"
import axios from 'axios'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UploadButton } from "@/components/uploadthing";
import { Car, Dealership } from "@prisma/client"
import { useState } from "react";

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
import { Delete, Loader2, Trash, Trash2 } from "lucide-react";

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


type ServerData = {
  uploadedBy: string;
};

type Image = {
  name: string;
  size: number;
  key: string;
  serverData: ServerData;
  url: string;
  // Add other properties if necessary
};

const AddDealershipForm = ({ dealership }: AddDealershipProps) => {

  const { toast } = useToast()
  const [images, setimages] = useState<Image[] | undefined>(undefined)
  const [imageIsDeleting, setimageIsDeleting] = useState(false)

  console.log('images')
  console.log(images)
  console.log('end images ===================')
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

    console.log('fuck off')
    console.log(values)
  }


  const handleImageDelete = async (image: Image) => {
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
                              console.log('Files: ', res)

                              // console.log(res)

                              if (images === undefined) {
                                setimages(res)
                              } else {
                                setimages([...images, ...res])
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
              PART 2</div>

          </div>



        </form>
      </Form>
    </div>
  )
}
export default AddDealershipForm