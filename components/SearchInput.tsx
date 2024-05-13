'use client'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const SearchInput = () => {
  return (
    <div className="relative  hidden sm:block">

      <Search className="absolute w-4 h-4  top-3 left-2" />
      <Input placeholder="Search" className="pl-8 " />

    </div>
  )
}
export default SearchInput