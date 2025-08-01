import { Words } from "../../const/Words";
import "./Footer.scss";
import { useLang } from "../../hooks/useLang";

export const Footer = () => {

    const lang = useLang() || 'uk';

    return (
        <footer className="footer">
            {Words.footerText[lang]}<sup>&copy;</sup> 2025
        </footer>
    )
}