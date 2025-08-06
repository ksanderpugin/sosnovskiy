import { Link } from "react-router-dom";
import { useLang } from "../../hooks/useLang";
import "./Logo.scss";
import { getHref } from "../../features/getHref";

export const Logo = () => {

    const lang =  useLang() || 'uk';

    return (
        <Link to={getHref(lang, '/')} className="logo">
            <img className="logo-icon" src={`/media/logo/logo_${lang}.svg`} alt="Sosnovskiy Online Shop" />
        </Link>
    );
}