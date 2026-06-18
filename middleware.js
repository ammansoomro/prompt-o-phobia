import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Browsing the feed and viewing profiles stays public; only authoring routes
// and the current-user API require a signed-in session. The mutating prompt
// routes additionally enforce ownership inside their handlers.
const isProtectedRoute = createRouteMatcher([
  "/create-prompt(.*)",
  "/update-prompt(.*)",
  "/profile",
  "/api/prompt/new(.*)",
  "/api/users/me(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
