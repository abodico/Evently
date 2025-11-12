import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/mongodb/database"
import Event from "@/lib/mongodb/database/models/event.model"

const sampleEvents = [
    {
        title: "Next.js Global Conference 2025",
        description:
            "A 3-day conference exploring Next.js 15, React Server Components, and modern web development practices.",
        location: "San Francisco, CA",
        imageUrl:
            "https://images.unsplash.com/photo-1522199710521-72d69614c702",
        startDateTime: new Date("2025-02-05T09:00:00Z"),
        endDateTime: new Date("2025-02-07T17:00:00Z"),
        price: "299",
        isFree: false,
        url: "https://nextconf.com",
        category: "673234c86c9d1a1b3f000101", // <-- ObjectId of a Category
        organizer: "673234a36c9d1a1b3f000201", // <-- ObjectId of a User
    },
    {
        title: "Frontend Dev Meetup",
        description:
            "Monthly networking meetup for frontend developers in the Bay Area.",
        location: "San Jose, CA",
        imageUrl:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        startDateTime: new Date("2025-01-20T18:00:00Z"),
        endDateTime: new Date("2025-01-20T21:00:00Z"),
        isFree: true,
        url: "https://meetup.com/frontend-bay",
        category: "673234c86c9d1a1b3f000102",
        organizer: "673234a36c9d1a1b3f000202",
    },
    {
        title: "AI in Design Workshop",
        description:
            "Learn how to use AI tools to enhance creativity and automate repetitive design tasks.",
        location: "New York City, NY",
        imageUrl:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        startDateTime: new Date("2025-02-15T10:00:00Z"),
        endDateTime: new Date("2025-02-15T16:00:00Z"),
        price: "99",
        isFree: false,
        url: "https://aidesignworkshop.com",
        category: "673234c86c9d1a1b3f000103",
        organizer: "673234a36c9d1a1b3f000203",
    },
    {
        title: "Startup Pitch Night",
        description:
            "Local founders pitch their startups to a panel of investors and mentors.",
        location: "Austin, TX",
        imageUrl: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51",
        startDateTime: new Date("2025-02-10T18:00:00Z"),
        endDateTime: new Date("2025-02-10T21:00:00Z"),
        price: "25",
        isFree: false,
        url: "https://startupnight.com",
        category: "673234c86c9d1a1b3f000104",
        organizer: "673234a36c9d1a1b3f000204",
    },
    {
        title: "Open Source Hackathon 2025",
        description:
            "Collaborate with developers worldwide to build open source tools in 48 hours.",
        location: "Remote",
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
        startDateTime: new Date("2025-03-10T09:00:00Z"),
        endDateTime: new Date("2025-03-12T18:00:00Z"),
        isFree: true,
        url: "https://hackathon.dev",
        category: "673234c86c9d1a1b3f000105",
        organizer: "673234a36c9d1a1b3f000205",
    },
    {
        title: "Photography Walk",
        description:
            "Capture the beauty of downtown during this guided photography walk.",
        location: "Chicago, IL",
        imageUrl:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        startDateTime: new Date("2025-03-20T09:00:00Z"),
        endDateTime: new Date("2025-03-20T13:00:00Z"),
        price: "15",
        isFree: false,
        url: "https://photowalkchicago.com",
        category: "673234c86c9d1a1b3f000106",
        organizer: "673234a36c9d1a1b3f000206",
    },
]

async function seed() {
    try {
        await connectToDatabase()

        // await Event.deleteMany({})
        // console.log("🧹 Cleared old events")

        const result = await Event.insertMany(sampleEvents)
        console.log(`✅ Inserted ${result.length} events`)
    } catch (error) {
        console.error("❌ Seeding error:", error)
    } finally {
        await mongoose.disconnect()
        console.log("🔌 Disconnected")
    }
}

seed()
