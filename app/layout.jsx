import '@styles/globals.css'

export const metadeta = {
    title: "Promt-O-Phobia",
    description: "Share those Prompts",
}

const RootLayout = ({children}) => {
    return (
        <html>
            <body>
                <div className="main">
                    <div className="gradient"></div>
                </div>

                <main className="app">
                    {children}
                </main>
            </body>
        </html>

    )
}

export default RootLayout