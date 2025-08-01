import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../../store/strore";
import "./Logo.scss";

export const Logo = () => {

    const lang = useSelector( (state: RootState) => state.user.lang );

    return (
        <Link to="/" className="logo">
            <img className="logo-icon" src={`/media/logo/logo_${lang}.svg`} alt="Sosnovskiy Online Shop" />
        </Link>
    );
}