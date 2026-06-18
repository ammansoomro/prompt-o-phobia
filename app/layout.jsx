import { ClerkProvider } from "@clerk/nextjs";
import "@styles/globals.css";
import Nav from "@components/Nav";

export const metadata = {
    title: "Prompt-O-Phobia",
    description: "A starlit observatory for discovering, creating, and sharing AI prompts.",
};

// Clerk's hosted modals inherit the Aurora Teal palette so sign-in matches.
const clerkAppearance = {
    variables: {
        colorPrimary: "#2dd4bf",
        colorBackground: "#05150f",
        colorText: "#eafff7",
        colorTextSecondary: "#8fb3a8",
        colorInputBackground: "#02110d",
        colorInputText: "#eafff7",
        borderRadius: "5px",
    },
};

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <ClerkProvider appearance={clerkAppearance}>
                    <div className="starfield" />
                    <div className="aurora-glow" />

                    <main className="app py-6">
                        <Nav />
                        {children}
                    </main>
                </ClerkProvider>
            </body>
        </html>
    );
};

export default RootLayout;
