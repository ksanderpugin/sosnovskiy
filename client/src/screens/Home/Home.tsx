import { useLang } from "../../hooks/useLang";
import { NotFound404 } from "../NotFound404/NotFound404";

export const Home = () => {

    const lang = useLang();

    if (lang === false) return <NotFound404 />
    return (<h2>Home</h2>);
}