import Image from "next/image"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { UploadButton } from '../../components/uploadthing'
import { useToast } from "../ui/use-toast"
import { Loader2, Trash2 } from "lucide-react"
import { SetStateAction } from "react"
import { ImageProps } from "../dealership/AddDealershipForm"

type MyFormImageUploadProps = {
  images: ImageProps[] | undefined,
  name: string,

  formControl: any,
  setimages: (images: ImageProps[]) => void,
  imageIsDeleting: boolean,
  handleImageDelete: (image: ImageProps) => void
}

const MyFormImageUpload = ({ images, name, formControl, setimages, imageIsDeleting, handleImageDelete }: MyFormImageUploadProps) => {


  const { toast } = useToast()
  return (
    <FormField
      control={formControl}
      name={name}
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

                {images.map((image: any) => (
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

                    // console.log(res)

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
  )
}
export default MyFormImageUpload