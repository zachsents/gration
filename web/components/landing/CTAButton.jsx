import { Button } from "@mantine/core"
import Link from "next/link"
import { TbWand } from "react-icons/tb"
import { useUser } from "reactfire"


export default function CTAButton() {

    const { data: user } = useUser()

    return (
        <Button
            size="lg" leftIcon={<TbWand />}
            variant="gradient" gradient={{ from: "primary.7", to: "red.7" }}
            className="mt-10 mb-16 rounded-md outline outline-8 outline-white hover:outline-8 hover:scale-105 transition"
            component={Link} href={user ? "/dashboard" : "/login?register"}
        >
            Set up your first Integration
        </Button>
    )
}
