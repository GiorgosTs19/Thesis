export function FlagSVG({className,width=24,height=24,onClick=()=>{},rotate='45def', cursor='pointer'}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{cursor:cursor,rotate:rotate}}
            className={className}
            onClick={onClick}
        >
            <path
                fillRule="evenodd"  clipRule="evenodd" fill="currentColor"
                d="M4 21H6V11H12V13H20V5H13V3H4V21ZM12 5H6V9H13V11H18V7H12V5Z"
            />
        </svg>
    )
}
