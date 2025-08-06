import { useDispatch, useSelector } from "react-redux";
import { ToBasketButton } from "../ToBasketButton/ToBasketButton";
import type { AppDispatch, RootState } from "../../store/strore";
import { showProductModal } from "../../store/slices/productModalSlice";
import "./ProductItem.scss";

type PropTypes = {
    id: number;
    title: string;
    image: string;
    price: number;
}

export const ProductItem = ({id, title, image, price}: PropTypes) => { 

    const dispatch = useDispatch<AppDispatch>();

    const product = useSelector( 
        (state: RootState) => 
            state.products.list.find( item => item.id === id) 
    );

    if (!product) return;
    
    const clickHandler = () => {
        dispatch(showProductModal(product));
    }

    return (
        <div className="product-item" onClick={clickHandler}>
            <div className="product-item__image">
                <img src={image} alt={title} />
            </div>
            <h2 className="product-item__title">{title}</h2>
            <p className="product-item__price">
                <span>{price}</span>
                грн/kg
            </p>
            <ToBasketButton id={id} packId={product.packs.length > 1 ? null : 0} />
        </div>
    );
}