import { useEffect, useRef } from "react";
import { useLang } from "../../hooks/useLang";
import { ProductItem } from "../ProductItem/ProductItem";
import "./ProductList.scss";
import { useParams } from "react-router-dom";
import { Loader } from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/strore";
import { fetchProductList, resetList } from "../../store/slices/productsSlice";

export const ProductList = () => {

    const { list, status } = useSelector( (state: RootState) => state.products );
    const dispatch = useDispatch<AppDispatch>();
    const lang = useLang() || 'uk';
    const { category } = useParams();
    const ref = useRef<HTMLDivElement>(null);

    // use effect fo reset data and load new
    useEffect( () => {
        dispatch(resetList());
        dispatch(fetchProductList({
            category: category || 'all',
            limit: '12'
        }));
    }, [category, dispatch]);


    // use effect for adding scroll listener for page pagination
    useEffect( () => {

        if (!ref.current) return;
        if (list.length < 12) return;

        window.onscroll = null;
        ref.current.onscroll = null;

        if (status !== 'fulfilled') return;
        

        const loadMore = () => {
            if (status !== 'fulfilled') return;
            const offset = document.querySelectorAll('.product-item').length;
            if (offset < 12) return;
            dispatch(fetchProductList({
                category: category || 'all',
                limit: '6',
                offset: offset.toString()
            }));
        }

        const scrollListener = () => {
            const el = document.querySelector('.product-item:last-child');
            if (el) {
                if (el.getBoundingClientRect().top < document.documentElement.clientHeight) {
                    loadMore();
                }
            }
        }

        ref.current.onscroll = scrollListener;
        window.onscroll = scrollListener;

    }, [category, list, dispatch, status]);

    return (
        <div className="product-list" ref={ref}>
            {list.map( 
                item => {
                    const nameField = lang === 'en' ? 'nameEN' : ( lang === 'ru' ? 'nameRU' : 'nameUK' );
                    return <ProductItem 
                        key={item.id}
                        id={item.id}
                        title={item[nameField]}
                        image={item.iconLink}
                        price={item.packs[0].cost || 0} />
                }
            )}
            {status === 'pending' && <div className="product-list__preloader"><Loader /></div>}
        </div>
    );
}