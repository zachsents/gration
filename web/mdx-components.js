

export function useMDXComponents(components) {
    return {
        img: (props) => <img {...props} className="rounded-lg" />,
        code: ({ children, ...props }) => <code {...props} className="bg-gray-100 rounded-sm px-2 py-1">{children}</code>,
        ...components,
    }
}