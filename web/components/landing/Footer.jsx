import { ActionIcon, Anchor, Divider, Group, Stack, Text } from "@mantine/core"
import Brand from "@web/components/landing/Brand"
import Link from "next/link"
import { TbBrandProducthunt, TbBrandX, TbChevronUp } from "react-icons/tb"


export default function Footer() {
    return (
        <footer className="mt-36 pt-36 pb-12 bg-pg-800 text-white">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-4 gap-12">
                    <Stack className="items-start">
                        <Brand />
                        <Text className="text-sm">
                            Building valuable SaaS tools means integrating with your users' data, but adding third-party integrations is complicated.
                        </Text>
                    </Stack>

                    <Stack className="text-sm [&_a]:text-white">
                        <Text className="font-bold">Explore</Text>

                        <Divider className="w-8" />

                        <Anchor component={Link} href="#how-it-works">
                            How It Works
                        </Anchor>
                        <Anchor component={Link} href="#integrations">
                            Integrations
                        </Anchor>
                        <Anchor component={Link} href="#pricing">
                            Pricing
                        </Anchor>
                    </Stack>

                    <Stack className="text-sm [&_a]:text-white">
                        <Text className="font-bold">Check Us Out</Text>

                        <Divider className="w-8" />

                        <Anchor href="https://x.com/Zach_Sents" target="_blank">
                            @Zach_Sents on <TbBrandX className="-mb-0.5" />
                        </Anchor>
                        <Anchor href="https://www.producthunt.com/posts/woahauth" target="_blank">
                            WoahAuth on ProductHunt <TbBrandProducthunt className="-mb-0.5" />
                        </Anchor>
                    </Stack>

                    <Stack className="text-sm [&_a]:text-white">
                        <Text className="font-bold">Get in Touch</Text>

                        <Divider className="w-8" />

                        <Anchor href="mailto:info@woahauth.com">
                            info@woahauth.com
                        </Anchor>
                    </Stack>
                </div>

                <Group className="justify-between items-end">
                    <Group className="text-sm mt-36">
                        <Text>&copy; {copyrightYear} WoahAuth - All rights reserved</Text>

                        <Anchor href="/terms.html" className="text-gray">
                            Terms of Service
                        </Anchor>
                        <Anchor href="/privacy.html" className="text-gray">
                            Privacy Policy
                        </Anchor>
                    </Group>

                    <ActionIcon
                        size="xl" radius="xl" variant="filled" color=""
                        component={Link} href="#"
                    >
                        <TbChevronUp />
                    </ActionIcon>
                </Group>
            </div>
        </footer>
    )
}


const copyrightYear = new Date().getFullYear()
