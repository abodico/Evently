// app/api/webhooks/clerk/route.ts
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { WebhookEvent } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/database"
import User from "@/lib/mongodb/database/models/user.model"
import {
    createUser,
    updateUser,
    deleteUser,
} from "@/lib/mongodb/actions/user.actions"
import { CreateUserParams, UpdateUserParams } from "@/types"

export async function POST(req: NextRequest) {
    try {
        // ✅ Verify and parse the Clerk webhook event
        const evt = await verifyWebhook(req)
        const { type, data } = evt as WebhookEvent

        console.log("✅ Clerk webhook received:", type)

        // Connect to MongoDB once before DB ops
        await connectToDatabase()

        // Handle events
        if (type === "user.created") {
            const user: CreateUserParams = {
                clerkId: data.id,
                email: data.email_addresses[0]?.email_address,
                firstName: data.first_name ?? "",
                lastName: data.last_name ?? "",
                username:
                    data.username ??
                    data.email_addresses[0]?.email_address.split("@")[0],
                photo: data.image_url,
            }

            const newUser = await createUser(user)
            return NextResponse.json({ message: "User created", user: newUser })
        }

        if (type === "user.updated") {
            const updatedUser: UpdateUserParams = await updateUser(data.id, {
                firstName: data.first_name ?? "",
                lastName: data.last_name ?? "",
                username: data.username ?? "",
                photo: data.image_url,
            })
            return NextResponse.json({
                message: "User updated",
                user: updatedUser,
            })
        }

        if (type === "user.deleted") {
            const deletedUser = await deleteUser(data.id!)
            return NextResponse.json({
                message: "User deleted",
                user: deletedUser,
            })
        }

        // Default case
        return NextResponse.json({ message: "Event received", type })
    } catch (err) {
        console.error("❌ Error verifying webhook:", err)
        return new NextResponse("Error verifying webhook", { status: 400 })
    }
}
