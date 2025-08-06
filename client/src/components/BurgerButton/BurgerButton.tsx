import { useDispatch } from "react-redux";
import "./BurgerButton.scss";
import type { AppDispatch } from "../../store/strore";
import { showMobileMenu } from "../../store/slices/mobileMenuSlice";

export const BurgerButton = () => {

    const dispatch = useDispatch<AppDispatch>();

    const onClickHandler = () => {
        dispatch(showMobileMenu());
    }

    return (
        <button className="burger-button" onClick={onClickHandler}>
            <span></span>
            <span></span>
            <span></span>
        </button>
    );
}