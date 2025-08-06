import { Link } from "react-router-dom"
import { useLang } from "../../hooks/useLang"
import { NotFound404 } from "../NotFound404/NotFound404";
import { getHref } from "../../features/getHref";
import { useEffect, useState } from "react";
import { Loader } from "../../components";
import parse from "html-react-parser";
import "./AboutUs.scss";

export const AboutUs = () => {

    const lang = useLang();

    const [loading, setLoading] = useState(false);

    const [html, setHtml] = useState('');

    useEffect( () => {
        if (!lang) return;
        setLoading(true);
        fetch(`${import.meta.env.VITE_BASE_URL}about/${lang}`)
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
        <section className="about-us wrapper">
            <h1 className="main-title">
                <Link to={getHref(lang, '/')}>Main</Link> ➤ About Us
            </h1>
            {loading && <div className="main-loader"><Loader /></div>}
            {parse(html)}
        </section>
    )
}