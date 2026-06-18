import { prisma } from "@utils/prisma";
import { auth } from "@clerk/nextjs/server";

export const GET = async () => {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return new Response("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) return new Response(JSON.stringify([]), { status: 200 });

        const prompts = await prisma.prompt.findMany({
            where: { creatorId: user.id },
            include: { creator: true },
            orderBy: { createdAt: "desc" },
        });

        return new Response(JSON.stringify(prompts), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch your prompts", { status: 500 });
    }
};
