"use server"

import { handleError } from "@/lib/utils"
import { CreateEventParams } from "@/types"
import { connectToDatabase } from "../database"
import User from "../database/models/user.model"
import Event from "../database/models/event.model"

export const createEvent = async ({
    event,
    userId,
    path,
}: CreateEventParams) => {
    try {
        await connectToDatabase()
        const organizer = await User.findOne({ clerkId: userId })
        console.log(organizer)
        if (!organizer) throw new Error("Organizer not found!")

        const newEvent = await Event.create({
            ...event,
            category: event.categoryId,
            organizer: organizer._id,
        })

        return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
        console.log(error)
        handleError(error)
    }
}
