import { prisma } from "@utils/prisma";

export const GET = async (request, { params }) => {
    try {
        const { id } = await params;
        const prompts = await prisma.prompt.findMany({
            where: { creatorId: id },
            include: { creator: true },
            orderBy: { createdAt: "desc" },
        });

        return new Response(JSON.stringify(prompts), {
            status: 200
        })
    } catch (error) {
        return new Response("Failed to fetch prompts created by user", {
            status: 500
        })
    }
}
