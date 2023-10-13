import { Anchor, Button, Center, Divider, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { createUserWithEmail, signInWithEmail, signInWithGoogle, useMustNotBeSignedIn } from "@web/modules/firebase/auth"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { useMutation } from "react-query"


export default function LoginPage() {

    useMustNotBeSignedIn()

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

    const googleMut = useMutation({
        mutationFn: signInWithGoogle,
        onError: (err) => setFormError(err.message.replace("Firebase: ", "")),
        onSuccess: () => router.push("/"),
    })

    const emailMut = useMutation({
        mutationFn: ({ email, password }) => isRegistering ?
            createUserWithEmail(email, password) :
            signInWithEmail(email, password),
        onError: (err) => setFormError(err.message.replace("Firebase: ", "")),
        onSuccess: () => router.push("/"),
    })

    const handleFormSubmit = values => {
        setFormError(null)
        emailMut.mutate(values)
    }

    return (
        <div className="flex h-screen max-h-screen w-screen items-stretch">
            <Center className="p-xl max-w-sm grow">
                <form onSubmit={form.onSubmit(handleFormSubmit)}>
                    <Stack>
                        <Title order={2} className="text-center mb-xl">
                            Welcome to Gration
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
                        />
                        <PasswordInput
                            label="Password" placeholder="123"
                            {...form.getInputProps("password")}
                            disabled={googleMut.isLoading || emailMut.isLoading}
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
                    </Stack>
                </form>
            </Center>
            <div className="bg-pg-800 flex-1"></div>
        </div>
    )
}