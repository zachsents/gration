import { Anchor, Button, Center, Divider, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import BrandCarousel from "@web/components/BrandCarousel"
import LegalLinks from "@web/components/LegalLinks"
import WaitlistAlert from "@web/components/WaitlistAlert"
import { createUserWithEmail, signInWithEmail, signInWithGoogle, useMustNotBeSignedIn } from "@web/modules/firebase/auth"
import { useIsMobile } from "@web/modules/util"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useMutation } from "react-query"


export default function LoginPage() {

    const isMobile = useIsMobile()
    const router = useRouter()
    const [formError, setFormError] = useState()
    const isRegistering = router.query.register !== undefined

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: {
            email: (value) => {
                if (value.trim().length === 0) {
                    return "Email is required"
                }
            },
            password: (value) => {
                if (value.trim().length === 0) {
                    return "Password is required"
                }
            },
        },
    })

    const onSuccess = () => {
        router.push("/dashboard/billing")
        notifications.clean()
    }

    const googleMut = useMutation({
        mutationFn: signInWithGoogle,
        onError: (err) => setFormError(err.message.replace("Firebase: ", "")),
        onSuccess,
    })

    const emailMut = useMutation({
        mutationFn: ({ email, password }) => isRegistering ?
            createUserWithEmail(email, password) :
            signInWithEmail(email, password),
        onError: (err) => setFormError(err.message.replace("Firebase: ", "")),
        onSuccess,
    })

    const handleFormSubmit = values => {
        setFormError(null)
        emailMut.mutate(values)
    }

    const shouldRedirectAway = !googleMut.isLoading && !googleMut.isSuccess &&
        !emailMut.isLoading && !emailMut.isSuccess
    useMustNotBeSignedIn(shouldRedirectAway && "/dashboard")

    return (
        <div className="flex min-h-screen w-screen items-stretch flex-col-reverse md:flex-row relative">
            <Center className="p-xl max-w-sm grow mx-auto">
                <form onSubmit={form.onSubmit(handleFormSubmit)}>
                    <Stack>
                        <WaitlistAlert />

                        <Title order={2} className="text-center mb-xl">
                            Welcome to WoahAuth
                        </Title>
                        <Button
                            variant="default" leftIcon={<FcGoogle />} radius="xl"
                            onClick={() => googleMut.mutate()}
                            loading={googleMut.isLoading} disabled={emailMut.isLoading}
                        >
                            Sign in with Google
                        </Button>
                        <Divider label="or continue with email" labelPosition="center" className="text-gray" />
                        <TextInput
                            label="Email" placeholder="mark@facebook.com"
                            {...form.getInputProps("email")}
                            disabled={googleMut.isLoading || emailMut.isLoading}
                            size={isMobile ? "md" : "sm"}
                        />
                        <PasswordInput
                            label="Password" placeholder="123"
                            {...form.getInputProps("password")}
                            disabled={googleMut.isLoading || emailMut.isLoading}
                            size={isMobile ? "md" : "sm"}
                        />

                        {formError &&
                            <Text className="text-red text-sm">{formError}</Text>}

                        <Button
                            type="submit"
                            loading={emailMut.isLoading} disabled={googleMut.isLoading}
                        >
                            {isRegistering ? "Create Account" : "Login"}
                        </Button>

                        {isRegistering ?
                            <Text className="text-gray text-sm text-center">
                                Already have an account? <Anchor component={Link} href="/login" span className="font-bold">
                                    Log in.</Anchor>
                            </Text> :
                            <Text className="text-gray text-sm text-center">
                                Don't have an account? <Anchor component={Link} href="/login?register" span className="font-bold">
                                    Register now.</Anchor>
                            </Text>}

                        <Anchor className="text-gray text-sm text-center" href={`mailto:info@woahauth.com?subject=Forgot%20Password${form.values.email ? `:%20${form.values.email}` : ""}`}>
                            Forgot your password?
                        </Anchor>
                    </Stack>
                </form>

                <LegalLinks className="absolute bottom-2 left-2" />
            </Center>
            <div className="bg-pg-800 flex-1 min-w-0 flex flex-col items-stretch py-12">
                <BrandCarousel />
            </div>
        </div>
    )
}
