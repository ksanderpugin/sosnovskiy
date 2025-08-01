import { Words } from "../../const/Words";
import { useLang } from "../../hooks/useLang";
import "./ToBasketButton.scss";

type PropTypes = {
    id: number;
}

export const ToBasketButton = ( { id }: PropTypes ) => {

    const lang = useLang() || 'uk';

    const addToBascketHandler = () => {
        console.log(`Add to basket ${id}`);
    }

    return (
        <div className="to-basket" onClick={addToBascketHandler}>
            {Words.toBasket[lang]}
        </div>
    )
}