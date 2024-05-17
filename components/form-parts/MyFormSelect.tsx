import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type MyFormSelectProps = {
  name: string,
  myFormLabel: string,
  myFormDescription: string,
  myFormPlaceholder: string,
  formControl: any,
  isLoading: boolean,
  dataToMap: any
}

const MyFormSelect = ({ name, myFormLabel, myFormDescription, myFormPlaceholder, formControl, isLoading, dataToMap }: MyFormSelectProps) => {


  if (dataToMap === undefined || dataToMap.length < 1) { return }

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

          <Select
            disabled={isLoading}
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}

          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={myFormPlaceholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>

              {dataToMap.map((location: any) => {

                return <SelectItem key={location.isoCode || location.name} value={location.isoCode || location.name}>
                  {location.name} {location?.flag}
                </SelectItem>
              })}

            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export default MyFormSelect