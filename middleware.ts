import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
    "/",
    "/events/:id",
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/uploadthing",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhooks(.*)",
])

export default clerkMiddleware(async (auth, req) => {
    // Allow public routes and webhooks
    if (isPublicRoute(req)) return

    const { userId, redirectToSignIn } = await auth()

    // Redirect if not signed in
    if (!userId) {
        return redirectToSignIn({ returnBackUrl: req.url })
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
}
