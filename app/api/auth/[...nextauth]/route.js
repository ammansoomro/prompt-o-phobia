import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import {
    connectToDB
} from '@utils/database'
import User from '@models/user'
const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    callbacks: {
        async session({
            session
        }) {
            const sessionUser = await User.findOne({
                email: session.user.email
            });

            session.user.id = sessionUser._id.toString();

            return session;
        },

        async signIn({
            profile
        }) {
            await connectToDB();

            // Check if a User Aleady Exists
            const userExists = await User.findOne({
                email: profile.email
            });
            // if not create a new user
            if (!userExists) {
                const newUser = new User({
                    email: profile.email,
                    username: profile.name.replace(/\s/g, "").toLowerCase(),
                    image: profile.image,
                });
                await newUser.save();
            }
            return true;
        }
    }


})

export {
    handler as GET, handler as POST
}