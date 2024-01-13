export function ChevronUpSVG({className,width=24,height=24,onClick=()=>{},rotate='45def'}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{cursor:"pointer",rotate:rotate}}
            className={className}
            onClick={onClick}
        >
            <path
                d="M17.6569 16.2427L19.0711 14.8285L12.0001 7.75739L4.92896 14.8285L6.34317 16.2427L12.0001 10.5858L17.6569 16.2427Z"
                fill="currentColor"
            />
        </svg>
    )
}
