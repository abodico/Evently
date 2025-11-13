import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    try {
        // ✅ Parse JSON body from the request
        const order = await req.json()

        const price = order.isFree ? 0 : Number(order.price) * 100

        // ✅ Create checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: price,
                        product_data: {
                            name: order.eventTitle,
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                eventId: order.eventId,
                buyerId: order.buyerId,
            },
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
        })

        // ✅ Return session URL to client
        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error("Stripe error:", err)
        return NextResponse.json(
            { error: err.message || "Something went wrong" },
            { status: err.statusCode || 500 }
        )
    }
}
