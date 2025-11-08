import { headers } from "next/headers"
import { Webhook } from "svix"
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import User from "@/lib/mongodb/database/models/user.model" // your Mongoose model
import { connectToDatabase } from "@/lib/mongodb/database"
import {
    createUser,
    deleteUser,
    updateUser,
} from "@/lib/mongodb/actions/user.actions"
import { CreateUserParams } from "@/types"

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET
    if (!WEBHOOK_SECRET) {
        throw new Error("Missing CLERK_WEBHOOK_SIGNING_SECRET")
    }

    const payload = await req.text()
    console.log(payload)
    const headerList = headers()
    const svix_id = headerList.get("svix-id")
    const svix_timestamp = headerList.get("svix-timestamp")
    const svix_signature = headerList.get("svix-signature")

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing svix headers", { status: 400 })
    }

    const wh = new Webhook(WEBHOOK_SECRET)
    let event: WebhookEvent

    try {
        event = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error("❌ Webhook verification failed:", err)
        return new Response("Invalid signature", { status: 400 })
    }

    const { type, data } = event

    if (type === "user.created") {
        const user: CreateUserParams = {
            clerkId: data.id,
            email: data.email_addresses[0]?.email_address,
            firstName: data.first_name ?? "",
            lastName: data.last_name ?? "",
            username: data.username!,
            photo: data.image_url,
        }

        const newUser = await createUser(user)

        if (newUser) {
            const clerk = await clerkClient() // get the actual client instance

            await clerk.users.updateUserMetadata(data.id, {
                publicMetadata: {
                    userId: newUser._id,
                },
            })
        }
        return NextResponse.json({ message: "OK", user: newUser })
    }
    if (type === "user.updated") {
        const user = {
            clerkId: data.id,
            email: data.email_addresses[0]?.email_address,
            firstName: data.first_name ?? "",
            lastName: data.last_name ?? "",
            username: data.username!,
            photo: data.image_url,
        }

        const updatedUser = await updateUser(data.id, user)

        if (updatedUser) {
            const clerk = await clerkClient() // get the actual client instance

            await clerk.users.updateUserMetadata(data.id, {
                publicMetadata: {
                    userId: updatedUser._id,
                },
            })
        }
        return NextResponse.json({ message: "OK", user: updatedUser })
    }

    if (type === "user.deleted") {
        const { id } = data
        const deletedUser = await deleteUser(id!)
        return NextResponse.json({ message: "OK", user: deletedUser })
    }

    return NextResponse.json({ received: true })
}
