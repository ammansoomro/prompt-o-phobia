import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@utils/prisma";

// Resolves the signed-in Clerk user to a Postgres User row, creating or
// updating it as needed. Prompts reference this row's `id` as their creator,
// so every authenticated write path goes through here to stay in sync.
export const getOrCreateUser = async () => {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    const username =
        clerkUser.username ||
        (clerkUser.firstName
            ? `${clerkUser.firstName}${clerkUser.lastName || ""}`
                  .replace(/\s/g, "")
                  .toLowerCase()
            : email?.split("@")[0]);

    // Prefer matching by Clerk id; fall back to email so users that predate
    // the Clerk migration get adopted instead of triggering a unique conflict.
    let user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
    if (!user && email) user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                clerkId: clerkUser.id,
                email,
                username,
                image: clerkUser.imageUrl,
            },
        });
    } else {
        user = await prisma.user.update({
            where: { id: user.id },
            data: {
                clerkId: clerkUser.id,
                ...(email ? { email } : {}),
                ...(user.username ? {} : { username }),
                image: clerkUser.imageUrl,
            },
        });
    }

    return user;
};
