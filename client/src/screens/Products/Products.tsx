import { CategoryList, ProductList } from "../../components";
import "./Products.scss";

export const Products = () => {

    return (
        <section className="products wrapper">
            <CategoryList />
            <ProductList />
        </section>
    );
}