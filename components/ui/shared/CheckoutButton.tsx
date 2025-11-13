"use client"

import { IEvent } from "@/lib/mongodb/database/models/event.model"
import { useUser } from "@clerk/nextjs"
import React from "react"
import { Button } from "../button"
import { SignedIn, SignedOut } from "@clerk/clerk-react"
import Link from "next/link"
import Checkout from "./Checkout"
type CheckoutButtonProps = {
    event: IEvent
}
const CheckoutButton = ({ event }: CheckoutButtonProps) => {
    const { user } = useUser()
    const userId = user?.publicMetadata.userId as string
    const hasEventFinished = new Date(event.endDateTime) < new Date()

    return (
        <div className="flex items-center gap-3">
            {/* cannot buy past events */}
            {hasEventFinished ? (
                <p className="p-2 text-red-400">
                    Sorry, tickets are no longer available
                </p>
            ) : (
                <>
                    <SignedOut>
                        <Button
                            className="button rounded-full"
                            size={"lg"}
                            asChild
                        >
                            <Link href="/sign-in">Get Tickets</Link>
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        <Checkout userId={userId} event={event} />
                    </SignedIn>
                </>
            )}
        </div>
    )
}

export default CheckoutButton
