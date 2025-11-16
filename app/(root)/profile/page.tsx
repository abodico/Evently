import { Button } from "@/components/ui/button"
import Collection from "@/components/shared/Collection"
import { getEventsByUser } from "@/lib/mongodb/actions/event.actions"
import { getOrdersByUser } from "@/lib/mongodb/actions/order.actions"
import { getUserByClerkId } from "@/lib/mongodb/actions/user.actions"
import { IOrder } from "@/lib/mongodb/database/models/order.model"
import { SearchParamProps } from "@/types"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import React from "react"

const page = async ({ searchParams }: SearchParamProps) => {
    const { userId } = await auth()
    const ordersPage = Number(searchParams?.ordersPage) || 1
    const currentUser = await getUserByClerkId(userId ?? "")
    const orders = await getOrdersByUser({
        userId: currentUser?._id,
        page: ordersPage,
    })
    const orderedEvents = orders?.data.map((order: IOrder) => order.event || [])
    const eventsPage = Number(searchParams?.eventsPage) || 1
    const organizedEvents = await getEventsByUser({
        userId: currentUser?._id,
        page: eventsPage,
    })

    console.log(orderedEvents)
    return (
        <>
            {/* my tickets */}
            <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
                <div className="wrapper flex items-center justify-center sm:justify-between">
                    <h3 className="h3-bold text-center sm:text-left">
                        My Tickets
                    </h3>
                    <Button asChild className="button hidden sm:flex">
                        <Link href="/#events">Explore More Events</Link>
                    </Button>
                </div>
            </section>
            <section className="wrapper my-8">
                <Collection
                    data={orderedEvents}
                    emptyTitle="No Event tickets purchased yet!"
                    emptyStateSubtext="No worries - plenty of exciting events to explore!"
                    collectionType="My_Tickets"
                    limit={3}
                    page={ordersPage}
                    totalPages={orders?.totalPages}
                    urlParamName="ordersPage"
                />
            </section>
            {/* my events */}
            {/* events organzied */}
            <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
                <div className="wrapper flex items-center justify-center sm:justify-between">
                    <h3 className="h3-bold text-center sm:text-left">
                        Events Organized
                    </h3>
                    <Button asChild className="button hidden sm:flex">
                        <Link href="/events/create">Create New Event</Link>
                    </Button>
                </div>
            </section>
            <section className="wrapper my-8">
                <Collection
                    data={organizedEvents?.data}
                    emptyTitle="No Event have been created yet!"
                    emptyStateSubtext="Go create some now"
                    collectionType="Events_Organized"
                    limit={6}
                    page={eventsPage}
                    totalPages={organizedEvents?.totalPages}
                    urlParamName="eventsPage"
                />
            </section>
        </>
    )
}

export default page
