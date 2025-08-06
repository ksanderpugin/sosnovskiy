import { Link } from "react-router-dom";
import { CheckOutForm, OrderList } from "../../components";
import { getHref } from "../../features/getHref";
import { useLang } from "../../hooks/useLang";
import { NotFound404 } from "../NotFound404/NotFound404";

export const CheckOut = () => {

    const lang = useLang();

    if (!lang) return (<NotFound404 />);

    return (
        <div className="wrapper">
            <h1 className="main-title">
                <Link to={getHref(lang, '/')}>Main</Link> ➤ CheckOut</h1>
            <OrderList />
            <CheckOutForm />
        </div>
    );
}