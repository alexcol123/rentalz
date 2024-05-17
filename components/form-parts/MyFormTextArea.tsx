
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Textarea } from '../ui/textarea';


// type MyFormInputProps = {
//   name: string,
//   myFormLabel: string,
//   myFormDescription: string,
//   myFormPlaceholder: string,
//   formControl: any
// }

type MyFormTextAreaProps = {
  name: string,
  myFormLabel: string,
  myFormDescription: string,
  myFormPlaceholder: string,
  formControl: any
}


const MyFormInput = ({ name, myFormLabel, myFormDescription, myFormPlaceholder, formControl }: MyFormTextAreaProps) => {
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
            <Textarea placeholder={myFormPlaceholder} {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />

  )
}
export default MyFormInput
