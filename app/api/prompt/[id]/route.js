import { prisma } from "@utils/prisma";
import { auth } from "@clerk/nextjs/server";

export const GET = async (request, { params }) => {
    try {
        const { id } = await params;
        const prompt = await prisma.prompt.findUnique({
            where: { id },
            include: { creator: true },
        });
        if (!prompt) return new Response("Prompt Not Found", { status: 404 });

        return new Response(JSON.stringify(prompt), { status: 200 });
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
};

export const PATCH = async (request, { params }) => {
    const { title, prompt, tag } = await request.json();

    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return new Response("Unauthorized", { status: 401 });

        const { id } = await params;
        const existingPrompt = await prisma.prompt.findUnique({ where: { id } });
        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Only the creator may edit their prompt.
        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user || existingPrompt.creatorId !== user.id) {
            return new Response("Forbidden", { status: 403 });
        }

        await prisma.prompt.update({
            where: { id },
            data: { title, prompt, tag },
        });

        return new Response("Successfully updated the Prompts", { status: 200 });
    } catch (error) {
        return new Response("Error Updating Prompt", { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return new Response("Unauthorized", { status: 401 });

        const { id } = await params;
        const existingPrompt = await prisma.prompt.findUnique({ where: { id } });
        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Only the creator may delete their prompt.
        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user || existingPrompt.creatorId !== user.id) {
            return new Response("Forbidden", { status: 403 });
        }

        await prisma.prompt.delete({ where: { id } });

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        return new Response("Error deleting prompt", { status: 500 });
    }
};
