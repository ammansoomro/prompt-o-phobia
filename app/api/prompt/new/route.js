import { prisma } from "@utils/prisma";
import { getOrCreateUser } from "@utils/user";
import { auth } from "@clerk/nextjs/server";

export const POST = async (req) => {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new Response("Unauthorized", { status: 401 });

    const { title, prompt, tag } = await req.json();

    try {
        // Resolve (or create) the Postgres user from the Clerk session rather
        // than trusting a client-supplied id.
        const user = await getOrCreateUser();
        if (!user) return new Response("Unauthorized", { status: 401 });

        const newPrompt = await prisma.prompt.create({
            data: {
                creatorId: user.id,
                title,
                prompt,
                tag,
            },
        });

        return new Response(JSON.stringify(newPrompt), { status: 201 });
    } catch (error) {
        return new Response("Error Creating a New Prompt", { status: 500 });
    }
};
