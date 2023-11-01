import classNames from "classnames"

export default function Section({ children, className, ...props }) {
    return (
        <div className={classNames("px-md", className)} {...props}>
            <div className="w-full max-w-5xl mx-auto">
                {children}
            </div>
        </div>
    )
}


export function SectionHeader({ children, className }) {
    return (
        <div className={classNames("max-w-3xl mx-auto text-center my-20", className)}>
            {children}
        </div>
    )
}