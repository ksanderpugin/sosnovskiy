import { Words } from "../../const/Words";
import { useLang } from "../../hooks/useLang";
import "./SignButtons.scss";

export const SignButtons = () => {

    const lang = useLang() || 'uk';

    return (
        <div className="sign-buttons">
            <button>{Words.login[lang]}</button>
            {/* <button>{Words.signup[lang]}</button> */}
        </div>
    )
}