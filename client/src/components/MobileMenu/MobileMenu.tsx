import { useDispatch, useSelector } from "react-redux";
import { LangSwitch, MainPhone, NavBar } from "../"
import "./MobileMenu.scss";
import type { AppDispatch, RootState } from "../../store/strore";
import { hideMobileMenu } from "../../store/slices/mobileMenuSlice";

export const MobileMenu = () => {

    const shown = useSelector( (state: RootState) => state.mobileMenu.shown );

    const dispatch = useDispatch<AppDispatch>();

    const onClickHandler = (cn: HTMLDivElement) => {
        if (['mobile-menu-wrapper', 'mobile-menu-close'].includes(cn.className) || cn.parentElement?.tagName.toLowerCase() === 'li') 
            dispatch(hideMobileMenu());
    }

    return (
        <div 
            className="mobile-menu-wrapper" 
            style={ {left: shown ? '0' : '100%'} }
            onClick={e => onClickHandler(e.target as HTMLDivElement)}>
            <div className="mobile-menu">
                <div className="mobile-menu-close"></div>
                <LangSwitch />
                <MainPhone />
                <NavBar />
            </div>
        </div>
    )
}