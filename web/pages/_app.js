import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import "@web/modules/firebase"
import { fire } from "@web/modules/firebase"
import "@web/styles/globals.css"
import { mantineTheme } from "@web/theme"
import { QueryClient, QueryClientProvider } from "react-query"
import { AuthProvider, FirebaseAppProvider, FirestoreProvider } from "reactfire"
import { FirebaseProvider } from "@zachsents/fire-query"


const queryClient = new QueryClient()


export default function MyApp({ Component, pageProps }) {
    return (
        <FirebaseAppProvider firebaseApp={fire.app}>
            <AuthProvider sdk={fire.auth}>
                <FirestoreProvider sdk={fire.db}>
                    <QueryClientProvider client={queryClient}>
                        <FirebaseProvider firestore={fire.db}>
                            <MantineProvider theme={mantineTheme} withNormalizeCSS withGlobalStyles withCSSVariables>
                                <ModalsProvider modals={modals}>
                                    {/* This wrapper makes the footer stick to the bottom of the page */}
                                    <div className="min-h-screen flex flex-col">
                                        <Component {...pageProps} />
                                    </div>
                                    <Notifications autoClose={3000} />
                                </ModalsProvider>
                            </MantineProvider>
                        </FirebaseProvider>
                    </QueryClientProvider>
                </FirestoreProvider>
            </AuthProvider>
        </FirebaseAppProvider>
    )
}

const modals = {

}

