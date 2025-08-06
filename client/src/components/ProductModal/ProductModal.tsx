import { useDispatch, useSelector } from "react-redux";
import { useLang } from "../../hooks/useLang"
import { ToBasketButton } from "../ToBasketButton/ToBasketButton"
import type { AppDispatch, RootState } from "../../store/strore";
import "./ProductModal.scss";
import { useCallback, useState } from "react";
import { Words } from "../../const/Words";
import { getNutritionalNode } from "../../features/getNutritionalNode";
import { hideProductModal } from "../../store/slices/productModalSlice";

export const ProductModal = () => {

    const lang = useLang() || 'uk';
    const { shown, product } = useSelector( (state: RootState) => state.productModal );
    const [packIndex, setPackIndex] = useState(0);

    const ref = useCallback((node: HTMLDivElement | null) => {
        if (node) 
            setTimeout( (_n: HTMLDivElement) => {
                _n.dataset.shown = 'true';
            }, 100, node);
        
    }, []);

    const dispatch = useDispatch<AppDispatch>();
    
    if (!product || !shown) return (<></>);

    const title = lang == 'en' ? product.nameEN : ( lang == 'ru' ? product.nameRU : product.nameUK );
    const ingredients = lang == 'en' ? product.ingredientsEN : ( lang == 'ru' ? product.ingredientsRU : product.ingredientsUK );
    const price = Math.round(product.packs[packIndex].cost * product.packs[packIndex].weight / 1000);

    const clickHandler = (el: HTMLDivElement) => {
        if (
            el.classList.contains('product-modal-wrapper') 
            || 
            el.classList.contains('product-modal-close')
        ) {
            const w = document.querySelector('.product-modal-wrapper') as HTMLDivElement;
            if (w) w.dataset.shown = "false";
            setTimeout( () => {
                setPackIndex(0);
                dispatch(hideProductModal());
            }, 550);
        }
    }

    return (
        <div className="product-modal-wrapper" data-shown="false" onClick={ e => clickHandler(e.target as HTMLDivElement)} ref={ref}>
            <div className="product-modal">
                <h2 className="product-modal__title">
                    <span>{title}</span>
                    <span className="product-modal-close"></span>
                </h2>
                <div className="product-modal__info">
                    <div className="product-modal__info-image">
                        <img src={product.iconLink} alt={title} />
                    </div>
                    <div className="product-modal__info-data">
                        <div className="product-modal__info-item">
                            <p className="product-modal__info-packs">
                                {product.packs.map( (item, index) => {
                                    return (
                                        <span 
                                            key={item.type}
                                            data-select={packIndex == index} 
                                            onClick={() => setPackIndex(index)}>
                                                
                                                {Words.packNames[lang][item.type]} ≈ {item.weight}g
                                        </span>
                                    )
                                })}
                            </p>
                            <div className="product-modal__info-price-and-basket">
                                <div className="product-modal__info-price">
                                    <p>
                                        <span>{product.packs[0].cost}</span>
                                        грн/kg
                                    </p>
                                    <p>
                                        (≈ {price} грн/уп)
                                    </p>
                                </div>
                                <ToBasketButton id={product.id} packId={packIndex}/>
                            </div>
                        </div>
                        <div className="product-modal__info-item">
                            <h3>{Words.ingredients[lang]}:</h3>
                            <p className="product-modal__info-ingredients">
                                {ingredients}
                            </p>
                        </div>
                        <div className="product-modal__info-item">
                            {getNutritionalNode(product.fat, product.protein, product.cal, lang)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}