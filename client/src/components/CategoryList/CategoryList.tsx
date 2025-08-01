import { useCallback, useEffect, useState } from "react";
import { useLang } from "../../hooks/useLang";
import { Words } from "../../const/Words";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getHref } from "../../features/getHref";
import "./CategoryList.scss";

type Category = {
    name: string;
    uk: string;
    en: string;
    ru: string;
}

export const CategoryList = () => {

    const lang = useLang() || 'uk';
    const { category = 'all' } = useParams();
    const [categories, setCategories] = useState<Category[]>([]);

    const pageNavigator = useNavigate();

    const showCategory = (cat: string) => {
        if (cat === 'all') pageNavigator( getHref(lang, '/') );
        else pageNavigator( getHref(lang, `/catalog/${cat}`) );
    }

    const fetchCategories = useCallback( () => {
        fetch(`${import.meta.env.VITE_BASE_URL}categories`)
            .then( resp => resp.json() )
            .then( data => {
                if (data.ok) setCategories(data.categories);
            })
            .catch( () => {
                setTimeout(fetchCategories, 500);
            });
    }, [] );

    useEffect( () => {
        fetchCategories();
    }, [fetchCategories]);

    return categories.length > 0 && (
        <>
            <ul className="categories-list">
                <li key={"all"} data-select={category === 'all'}><Link to={getHref(lang, '/')}>{Words.allProducts[lang]}</Link></li>
                {categories.map( 
                    item => 
                        <li key={item.name} data-select={category === item.name}>
                            <Link to={getHref(lang, `/catalog/${item.name}`)}>{item[lang]}</Link>
                        </li>
                )}
            </ul>
            <div className="categories-select">
                <select onChange={e => {showCategory(e.target.value)}} value={category} name="category">
                    <option value="all">{Words.allProducts[lang]}</option>
                    {categories.map( 
                    item => 
                        <option key={item.name} value={item.name}>
                            {item[lang]}
                        </option>
                )}
                </select>
            </div>
        </>
    );
}