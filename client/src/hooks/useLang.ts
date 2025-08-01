import { useLocation, useParams } from "react-router-dom";
import type { Lang } from "../types/Lang";

export function useLang(): Lang | false {
    const { lang } = useParams();
    const { pathname } = useLocation();

    if (lang === undefined) {
        if (pathname.startsWith('/en')) return 'en';
        if (pathname.startsWith('/ru')) return 'ru';
        return 'uk';
    }

    if ( ['en', 'ru'].includes(lang)) return lang as Lang;

    return false;
}