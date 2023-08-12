import '@styles/globals.css'
import Nav from '@components/Nav'
import Provider from '@components/Provider'
export const metadeta = {
    title: "Promt-O-Phobia",
    description: "Share those Prompts",
}

const RootLayout = ({ children }) => {
    return (
        <html>
            <body>
                <Provider>
                    <div className="main">
                        <div className="gradient"></div>
                    </div>

                    <main className="app">
                        <Nav />
                        {children}
                    </main>
                </Provider>
            </body>
        </html >

    )
}

export default RootLayout