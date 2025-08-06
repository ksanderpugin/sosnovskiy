import { useEffect, useState } from "react";
import { useLang } from "../../hooks/useLang";
import { NotFound404 } from "../NotFound404/NotFound404";
import { Link } from "react-router-dom";
import { getHref } from "../../features/getHref";
import { Loader } from "../../components";
import parse from "html-react-parser";
import "./ShippingAndPay.scss";

export const ShippingAndPayment = () => {

    const lang = useLang();

    const [loading, setLoading] = useState(false);

    const [html, setHtml] = useState('');

    useEffect( () => {
        if (!lang) return;
        setLoading(true);
        fetch(`${import.meta.env.VITE_BASE_URL}shipping/${lang}`)
            .then( resp => resp.json() )
            .then( data => {
                if (data.ok) {
                    setHtml(data.html);
                    setLoading(false);
                }
            });
    }, [lang]);

    if (!lang) return (<NotFound404 />);

    return (
        <section className="shipping wrapper">
            <h1 className="main-title">
                <Link to={getHref(lang, '/')}>Main</Link> ➤ hipping and payment
            </h1>
            {loading && <div className="main-loader"><Loader /></div>}
            {parse(html)}
        </section>
    )
}