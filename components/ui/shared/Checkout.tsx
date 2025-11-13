import { IEvent } from "@/lib/mongodb/database/models/event.model"
import React from "react"
import { Button } from "../button"
import { POST } from "@/app/api/checkout_sessions/route"

type CheckoutProps = {
    event: IEvent
    userId: string
}
const Checkout = ({ event, userId }: CheckoutProps) => {
    const onCheckout = async () => {
        const order = {
            eventTitle: event.title,
            eventId: event._id,
            price: event.price ?? "0",
            isFree: event.isFree,
            buyerId: userId,
        }
        // checkoutOrder
        // await POST(order)
        const res = await fetch("/api/checkout_sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
        })

        const data = await res.json()
        if (data.url) window.location.href = data.url
        else alert("Error: " + data.error)
    }
    return (
        <form action={onCheckout} method="post">
            <Button
                type="submit"
                role="link"
                size={"lg"}
                className="button sm:w-fit"
            >
                {event.isFree ? "Get Ticket" : "Buy Ticket"}
            </Button>
        </form>
    )
}

export default Checkout
