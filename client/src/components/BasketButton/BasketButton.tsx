import { useNavigate } from "react-router-dom";
import { Words } from "../../const/Words";
import { useLang } from "../../hooks/useLang";
import "./BasketButton.scss";
import { getHref } from "../../features/getHref";

export const BasketButton = () => {

    const lang = useLang() || 'uk';

    const navTo = useNavigate();

    return (
        <button className="basket-button" onClick={ () => navTo(getHref(lang, '/checkout'))}>
            <span className="basket-button__icon">10</span>
            <span>{Words.basket[lang]}</span>
        </button>
    )
}