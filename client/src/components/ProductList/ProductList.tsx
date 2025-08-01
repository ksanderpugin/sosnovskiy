import { useEffect, useRef, useState } from "react";
import { useLang } from "../../hooks/useLang";
import { ProductItem } from "../ProductItem/ProductItem";
import type { ProductItemType } from "../../types/ProductItemType";
import "./ProductList.scss";
import { useParams } from "react-router-dom";
import { Loader } from "../Loader/Loader";

export const ProductList = () => {

    const [list, setList] = useState<ProductItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const lang = useLang() || 'uk';
    const { category } = useParams();
    const ref = useRef<HTMLDivElement>(null);

    useEffect( () => {
        setList([]);
        setIsLoading(true);
        const params = new URLSearchParams({
            category: category || 'all',
            limit: '12'
        });
        fetch(`${import.meta.env.VITE_BASE_URL}products?${params}`)
            .then( resp => resp.json() )
            .then( data => {
                if (data.ok) setList(data.products);
                setIsLoading(false);
            })
            .catch( () => {
                console.error('Error get products');
            });
    }, [category]);

    useEffect( () => {

        if (!ref.current) return;
        if (list.length < 12) return;
        let stopListener = false;

        const loadMore = () => {
            stopListener = true;
            const offset = document.querySelectorAll('.product-item').length;
            if (offset < 12) return;
            const params = new URLSearchParams({
                category: category || 'all',
                limit: '6',
                offset: offset.toString()
            });
            setIsLoading(true);
            fetch(`${import.meta.env.VITE_BASE_URL}products?${params}`)
                .then( resp => resp.json() )
                .then( data => {
                    if (data.ok) {
                        if (data.products.length > 0) {
                            setList([...list, ...data.products]);
                            setTimeout(() => {
                                stopListener = false;
                            }, 1000);
                        }
                    }
                    setIsLoading(false);
                })
                .catch( () => {
                    console.error('Error get products');
                });
        }

        const scrollListener = () => {
            if (stopListener) return;
            const el = document.querySelector('.product-item:last-child');
            if (el) {
                if (el.getBoundingClientRect().top < document.documentElement.clientHeight) {
                    loadMore();
                }
            }
        }

        ref.current.onscroll = scrollListener;
        window.onscroll = scrollListener;

    }, [category, list]);

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
            {isLoading && <div className="product-list__preloader"><Loader /></div>}
        </div>
    );
}