import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "@styles/globals.css";
import Nav from "@components/Nav";

export const metadata = {
    title: "Prompt-O-Phobia",
    description: "A starlit observatory for discovering, creating, and sharing AI prompts.",
};

// Clerk's hosted sign-in/sign-up modals themed to match Aurora Teal — the
// same surfaces, borders, and glow used by the .card/.input classes in
// globals.css, via Clerk's `elements` appearance API rather than a
// hand-built auth form.
const clerkAppearance = {
    baseTheme: dark,
    variables: {
        colorPrimary: "#2dd4bf",
        colorBackground: "#05150f",
        colorText: "#eafff7",
        colorTextSecondary: "#8fb3a8",
        colorInputBackground: "#02110d",
        colorInputText: "#eafff7",
        colorDanger: "#f87171",
        colorSuccess: "#2dd4bf",
        colorShimmer: "rgba(45, 212, 191, 0.18)",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        borderRadius: "10px",
    },
    elements: {
        modalBackdrop: {
            backgroundColor: "rgba(2, 8, 6, 0.7)",
            backdropFilter: "blur(6px)",
        },
        card: {
            backgroundColor: "#05150f",
            border: "1px solid rgba(45, 212, 191, 0.18)",
            boxShadow:
                "inset 0 0 24px rgba(234, 255, 247, 0.06), 0 24px 80px rgba(2, 8, 6, 0.6)",
        },
        headerTitle: { color: "#eafff7", fontWeight: 500 },
        headerSubtitle: { color: "#8fb3a8" },
        socialButtonsBlockButton: {
            backgroundColor: "#08231a",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#eafff7",
            "&:hover": { backgroundColor: "#0c3528" },
        },
        socialButtonsBlockButtonText: { color: "#eafff7" },
        dividerLine: { backgroundColor: "rgba(255, 255, 255, 0.08)" },
        dividerText: { color: "#6f9389" },
        formFieldLabel: { color: "#8fb3a8" },
        formFieldInput: {
            backgroundColor: "#02110d",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#eafff7",
            "&:focus": { borderColor: "rgba(45, 212, 191, 0.5)" },
        },
        formFieldInputShowPasswordButton: { color: "#6f9389" },
        formButtonPrimary: {
            backgroundColor: "#08231a",
            color: "#eafff7",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#0c3528" },
            "&:focus": { boxShadow: "none" },
        },
        footerActionText: { color: "#6f9389" },
        footerActionLink: { color: "#2dd4bf" },
        identityPreviewText: { color: "#eafff7" },
        identityPreviewEditButton: { color: "#2dd4bf" },
        alertText: { color: "#f87171" },
        otpCodeFieldInput: {
            backgroundColor: "#02110d",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#eafff7",
        },
        modalCloseButton: { color: "#8fb3a8" },
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
