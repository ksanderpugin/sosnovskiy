import { BasketButton, BurgerButton, LangSwitch, Logo, MainPhone, NavBar, SignButtons } from "../";
import "./Header.scss";

export const Header = () => {

    return (
        <header className="header">
            <div className="wrapper">
                <Logo />
                <div className="header-content">
                    <div>
                        <div className="header-content__sign-and-phone">
                            <SignButtons />
                            <MainPhone />
                        </div>
                        <div className="header-content__lang-and-basket">
                            <LangSwitch />
                            <BasketButton />
                        </div>
                        <BurgerButton />
                    </div>
                    <NavBar />
                </div>
            </div>
        </header>
    )
}