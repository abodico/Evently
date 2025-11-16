import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"

const Header = () => {
    return (
        <header className="w-full border-b">
            <div className="wrapper flex items-center justify-between">
                <Link href="/" className="w-36">
                    <Image
                        src="/assets/images/logo.svg"
                        width={128}
                        height={38}
                        alt="Evently-logo"
                    />
                </Link>
                <SignedIn>
                    <nav className="md:flex-between hidden w-full max-w-xs">
                        <NavItems />
                    </nav>
                </SignedIn>
                <div className="flex w-32 justify-end gap-3">
                    <SignedIn>
                        <UserButton />
                        <MobileNav />
                    </SignedIn>
                    <SignedOut>
                        <Button asChild className="rounded-full" size="lg">
                            <Link href="/sign-in">Login</Link>
                        </Button>
                        {/* <SignInButton />
                        <SignUpButton>
                            <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                                Sign Up
                            </button>
                        </SignUpButton> */}
                    </SignedOut>
                </div>
            </div>
        </header>
    )
}

export default Header
