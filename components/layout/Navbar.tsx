'use client'
import {

  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignUpButton
} from "@clerk/nextjs";
import Container from "../Container";
import { Car, CarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SearchInput from "../SearchInput";
import ThemeToggle from "../ui/theme-toggle";
import NavMenu from "./NavMenu";


const Navbar = () => {

  const router = useRouter()
  return (


    <div className="sticky top-0 border bg-b-primary bg-secondary">
      <Container >

        <div className="flex justify-between">
          <div

            onClick={() => router.push('/')}
            className="flex items-center  gap-1 cursor-pointer">

            <div className="font-bold text-primary">R<span className="text-secondary-foreground">entalz</span></div>
            <CarIcon className="text-primary" />
          </div>




          <SearchInput />

          <div className="flex justify-center items-center gap-4">
            <div>
              <ThemeToggle />
              <NavMenu />
            </div>


            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>


            <SignedOut>
              <Button variant={'outline'}>
                <SignInButton />
              </Button>

              <Button>
                <SignUpButton />
              </Button>
            </SignedOut>


          </div>
        </div>
      </Container>
    </div>


  )
}
export default Navbar