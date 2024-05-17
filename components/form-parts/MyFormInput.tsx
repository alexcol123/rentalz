
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '../ui/input';


type MyFormInputProps = {
  name: string,
  myFormLabel: string,
  myFormDescription: string,
  myFormPlaceholder: string,
  formControl: any
}


const MyFormInput = ({ name, myFormLabel, myFormDescription, myFormPlaceholder, formControl }: MyFormInputProps) => {
  return (



    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{myFormLabel}</FormLabel>

          <FormDescription>
            {myFormDescription}
          </FormDescription>

          <FormControl>
            <Input placeholder={myFormPlaceholder} {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />

  )
}
export default MyFormInput
