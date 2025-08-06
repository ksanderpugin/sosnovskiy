import type { Lang } from "../types/Lang";

export const getNutritionalNode = (fat:number, protein:number, cal:number, lang:Lang) => {

    switch (lang) {
        case 'en':
            return (
                <>
                    <p>Nutritional Facts</p>
                    <p><b>Serving size 100g</b></p>
                    <p><b>Calories {cal}</b></p>
                    <p><b>Total fat</b> {fat}g | <b>Protein</b> {protein}g</p>
                </>
            );

        case 'ru':
            return (
                <>
                    <p>Пищевая ценность 100 грамм продукта:</p>
                    <p>белка - не менее {protein} г; жира - не более {fat} г</p>
                    <p><b>Енергетическая ценность:</b> {cal} ккал</p>
                </>
            );

        default:
            return (
                <>
                    <p>Харчова цінність 100 грам продукту:</p>
                    <p>білка - не меньше ніж {protein} г; жиру - не більше ніж {fat} г</p>
                    <p><b>Енергетична цінність:</b> {cal} ккал</p>
                </>
            )
    }
}