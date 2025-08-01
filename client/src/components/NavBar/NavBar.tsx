import { Link, useLocation } from "react-router-dom"
import { getHref } from "../../features/getHref"
import { useLang } from "../../hooks/useLang"
import { Words } from "../../const/Words";
import "./NavBar.scss";

export const NavBar = () => {

    const lang = useLang() || 'uk';

    const {pathname} = useLocation();

    return (
        <ul className="nav-bar">
            <li data-shown={pathname.length > 3 && pathname.indexOf('/catalog/') < 0}>
                <Link to={getHref(lang, '/')}>{Words.products[lang]}</Link>
            </li>

            <li data-shown={!pathname.endsWith('about')}>
                <Link to={getHref(lang, '/about')}>{Words.aboutUs[lang]}</Link>
            </li>

            <li data-shown={!pathname.endsWith('shipping-info')}>
                <Link to={getHref(lang, '/shipping-info')}>{Words.shipping[lang]}</Link>
            </li>

            <li data-shown={!pathname.endsWith('contacts')}>
                <Link to={getHref(lang, '/contacts')}>{Words.contacts[lang]}</Link>
            </li>
        </ul>
    )
}