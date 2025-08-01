import type { ProductPackType } from "./ProductPackType";

export type ProductItemType = {
    id: number;
    iconLink: string;
    nameUK: string;
    nameEN: string;
    nameRU: string;
    packs: ProductPackType[];
}