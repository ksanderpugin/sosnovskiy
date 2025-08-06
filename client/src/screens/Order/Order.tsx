import { useDispatch, useSelector } from "react-redux";
import { useLang } from "../../hooks/useLang"
import type { AppDispatch, RootState } from "../../store/strore";
import { Link, useParams } from "react-router-dom";
import { getHref } from "../../features/getHref";
import { NotFound404 } from "../NotFound404/NotFound404";
import { useEffect, useState } from "react";
import { setOrder } from "../../store/slices/orderSlice";
import { Loader, OrderList } from "../../components";
import { Words } from "../../const/Words";
import "./Order.scss";
import { shops } from "../../const/Shops";

export const Order = () => {

    const lang = useLang();
    const {number} = useParams();

    const order = useSelector( (state: RootState) => state.order.order );
    const dispatch = useDispatch<AppDispatch>();

    const [error, setError] = useState('');

    useEffect( () => {
        if (!order || number !== order.number) {
            fetch(`${import.meta.env.VITE_BASE_URL}order/${number}`)
                .then( resp => resp.json() )
                .then( data => {
                    if (data.ok) {
                        dispatch(setOrder(data.order));
                    } else {
                        setError(data.error);
                    }
                })
        }
    }, [number, order, dispatch]);

    if (!lang) return (<NotFound404 />);

    if (error) return (<p>{error}</p>);

    if (!order || order.number != number) return (<div className="loader-wrapper"><Loader/></div>);

    const getAddress = () => {
        if (order.deliveryType === 0) {
            const shop = shops.find( item => item.name === order.deliveryData.shop )
            if (shop) return shop.address[lang];
            return '';
        }
        
        return `${order.deliveryData.city}, ${order.deliveryData.address}`;
    }
    return (
        <section className="order-info wrapper">
            <h1 className="main-title">
                <Link to={getHref(lang, '/')}>Main</Link> ➤ Order {order.id} Preview 
            </h1>
            <p>State: {Words.orderStates[order.state][lang]}</p>
            <p>Client: {order.clientName}, {order.phone}</p>
            <p>{Words.deliveryTypes[order.deliveryType][lang]}: {getAddress()}</p>
            <p>Shipment date: {order.dateDelivery}</p>

            <OrderList order={order.basket} />
        </section>
    )
}