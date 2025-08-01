import { Link } from "react-router-dom";

export const NotFound404 = () => (
    <div className="not-found-screen">
        <p>Oops! Page not found</p>
        <h1>404</h1>
        <h2>we are sorry, but the page you requested was not found</h2>
        <Link to="/" className="button">go to homepage</Link>
    </div>
)