import { useNavigate } from "react-router-dom";
import { Words } from "../../const/Words";
import { useLang } from "../../hooks/useLang";
import "./BasketButton.scss";
import { getHref } from "../../features/getHref";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/strore";

export const BasketButton = () => {

    const lang = useLang() || 'uk';

    const basketSize = useSelector( (state: RootState) => Object.keys(state.basket.list).length );

    const navTo = useNavigate();

    const clickHandler = () => {
        if (basketSize > 0) navTo(getHref(lang, '/checkout'));
    }

    return (
        <button className="basket-button" onClick={clickHandler}>
            <span className="basket-button__icon">{basketSize}</span>
            <span>{Words.basket[lang]}</span>
        </button>
    )
}