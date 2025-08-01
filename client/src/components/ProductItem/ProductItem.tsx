import { ToBasketButton } from "../ToBasketButton/ToBasketButton";
import "./ProductItem.scss";

type PropTypes = {
    id: number;
    title: string;
    image: string;
    price: number;
}

export const ProductItem = ({id, title, image, price}: PropTypes) => (
    <div className="product-item">
        <div className="product-item__image">
            <img src={image} alt={title} />
        </div>
        <h2 className="product-item__title">{title}</h2>
        <p className="product-item__price">
            <span>{price}</span>
            грн/kg
        </p>
        <ToBasketButton id={id} />
    </div>
)