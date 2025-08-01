import { Link, useLocation } from "react-router-dom";
import "./LangSwitch.scss";
import { useLang } from "../../hooks/useLang";
import { getHref } from "../../features/getHref";

export const LangSwitch = () => {

    const {pathname} = useLocation();
    const lang = useLang() || 'uk';

    const baseHref = lang === 'uk'
        ? pathname
        : pathname.substring(3);

    return (
        <ul className="langs">
            <li>
                <Link to={getHref('uk', baseHref)}>UA</Link>
            </li>
            <li>
                <Link to={getHref('en', baseHref)}>EN</Link>
            </li>
            <li>
                <Link to={getHref('ru', baseHref)}>RU</Link>
            </li>
        </ul>
    )
}