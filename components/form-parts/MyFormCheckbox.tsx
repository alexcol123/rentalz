import { Checkbox } from "../ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

const MyFormCheckbox = ({ name, myFormLabel, myFormDescription, myFormPlaceholder, formControl }: any) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-end    space-x-3 ">

          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>

          <FormLabel className="capitalize">
            {name}
          </FormLabel>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export default MyFormCheckbox