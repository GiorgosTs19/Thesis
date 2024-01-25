import {useEffect} from "react";

export function useScrollIntoView(ref) {
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [ref.current]);
}
