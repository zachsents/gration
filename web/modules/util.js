import { useViewportSize } from "@mantine/hooks"


export function useIsMobile() {
    const { width } = useViewportSize()
    return width < 772
}