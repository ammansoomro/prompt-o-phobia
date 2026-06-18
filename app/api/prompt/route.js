import { prisma } from "@utils/prisma";

export const GET = async (request) => {
    try {
        const prompts = await prisma.prompt.findMany({
            include: { creator: true },
            orderBy: { createdAt: "desc" },
        });

        return new Response(JSON.stringify(prompts), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
}
