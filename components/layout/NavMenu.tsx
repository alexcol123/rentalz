"use client"

import * as React from "react"
import { BookOpenCheck, Car, ChevronsUpDown, Hotel, PlusIcon } from "lucide-react"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function NavMenu() {
  const router = useRouter()


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer flex gap-2 items-center" onClick={() => router.push(`dealership/new`)}>
          <PlusIcon size={15} /><span> Add Dealership</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex gap-2 items-center" onClick={() => router.push(`dealership/new`)}>
          <Car size={15} /><span> My Dealerships</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex gap-2 items-center" onClick={() => router.push(`dealership/new`)}>
          <BookOpenCheck size={15} /><span> My Car Bookings </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
