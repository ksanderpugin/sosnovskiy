import type { Lang } from "../types/Lang";

export const getHref = ( lang: Lang, href: string): string => {
    if (lang == 'uk') return href;
    if (href === '/') href = '';
    return `/${lang}${href}`;
}