import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useLang } from "../../hooks/useLang";
import { Words } from "../../const/Words";
import { IMaskInput } from "react-imask";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/strore";
import "./CheckOutForm.scss";
import { setOrder } from "../../store/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import { getHref } from "../../features/getHref";
import { clearBasket } from "../../store/slices/basketSlice";
import { shops } from "../../const/Shops";

type DayItemType = {
    dayNumber: number;
    day: number;
    month: number;
    date: string;
}

export const CheckOutForm = () => {

    const lang = useLang() || 'uk';

    const basket = useSelector( (state:RootState) => state.basket.list );

    const dispatch = useDispatch<AppDispatch>();

    const pageNavigator = useNavigate();

    const [deliveryType, setDeliveryType] = useState('np');
    const [days, setDays] = useState<DayItemType[]>([]);
    const [errors, setErrors] = useState< Record<string, string> >({});
    const [phoneComplete, setPhoneComplete] = useState(false);

    const dtOnChange = (type: string) => {
        if (deliveryType !== type) setDeliveryType(type);
    }

    const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const sendData: Record<string, string> = {};
        const newErrors: Record<string, string> = {};
        for (const [key, value] of data.entries()) {
            sendData[key] = value.toString();
            switch(key) {
                case 'first-name':
                    if (value.toString().length < 3) newErrors['firstName'] = 'First name cannot be shorter than 3 characters!';
                    break;

                case 'last-name':
                    if (value.toString().length < 3) newErrors['lastName'] = 'Last name cannot be shorter than 3 characters!';
                    break;

                case "phone":
                    if (!phoneComplete) newErrors['phone'] = 'Enter valid phone number!';
                    break;
            }
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        sendData.basket = JSON.stringify(basket);
        fetch(`${import.meta.env.VITE_BASE_URL}order`, {
            method: 'POST',
            body: JSON.stringify(sendData)
        })
            .then( resp => resp.json() )
            .then( data => {
                if (data.ok) {
                    dispatch(setOrder(data.order));
                    pageNavigator(getHref(lang, `/order/${data.order.number}`));
                    dispatch(clearBasket());
                }
            });
    }

    const fetchDates = useCallback( () => {
        fetch(`${import.meta.env.VITE_BASE_URL}shippingDates`)
            .then( resp => resp.json() )
            .then( data => {
                if (data.ok) setDays(data.dates);
            })
            .catch( error => {
                console.log(`FETCH DATES ERROR: ${error}`);
                setTimeout( () => fetchDates(), 500);
            });
    }, []);

    const getDateString = (dayNumber: number, day:number, month:number): string => {
        if (lang == 'en') 
            return `${Words.dayNames[lang][dayNumber]}, ${Words.monthNames[lang][month]} ${day}`;

        else
            return `${Words.dayNames[lang][dayNumber]}, ${day} ${Words.monthNames[lang][month]}`;
    }

    useEffect( () => {
        fetchDates()
    }, [fetchDates]);

    return (
        <div className="checkout-form">
            <form onSubmit={onSubmitHandler}>
                <div className="checkout-form__item">
                    <label>First name</label>
                    <input type="text" placeholder="Enter your first name" name="first-name" required />
                    {errors.firstName && <span>{errors.firstName}</span>}
                </div>
                <div className="checkout-form__item">
                    <label>Last name</label>
                    <input type="text" placeholder="Enter your last name" name="last-name" required />
                    {errors.lastName && <span>{errors.lastName}</span>}
                </div>
                <div className="checkout-form__item">
                    <label>Phone</label>
                    {/* <input type="tel" placeholder="Enter your phone" name="phone" /> */}
                    <IMaskInput 
                        mask={'+38 (000) 000-00-00'}
                        onAccept={ () => setPhoneComplete(false) }
                        onComplete={ () => {
                            setPhoneComplete(true); 
                            setErrors({...errors, phone: ''});
                        } }
                        name="phone"
                        required
                        lazy={false}
                    />
                    {errors.phone && <span>{errors.phone}</span>}
                </div>
                
                <div className="checkout-form__item">
                    <label>How to contact you?</label>
                    <select name="contact-by">
                        <option value={0}>Call</option>
                        <option value={1}>Viber</option>
                        <option value={2}>Telegram</option>
                    </select>
                </div>
                <div className="checkout-form__item">
                    <label>Delivery by</label>
                    <select name="delivery-type" value={deliveryType} onChange={ e => dtOnChange(e.target.value) }>
                        <option value="np">Nova Post</option>
                        <option value="pp">Pickup</option>
                    </select>
                </div>

                {deliveryType == 'np' && 
                    <>
                    <div className="checkout-form__item checkout-form__item--np">
                        <label>City</label>
                        <input type="text" placeholder="Enter your city" name="city" />
                    </div>
                    <div className="checkout-form__item checkout-form__item--np">
                        <label>Post number</label>
                        <input type="text" placeholder="Enter your city" name="address" />
                    </div>
                    </>}
                
                {deliveryType == 'pp' && 
                    <div className="checkout-form__item checkout-form__item--pp">
                        <label>Ofline shop</label>
                        <select name="shop">
                            {shops.map( item => <option value={item.name} key={item.name}>{item.address[lang]}</option>)}
                        </select>
                    </div>}

                <div className="checkout-form__item checkout-form__item--day">
                    <label>Delivery Day</label>
                    <select name="delivery-day">
                        {days.map( 
                            item => 
                                <option value={item.date} key={item.date}>
                                    {getDateString(item.dayNumber, item.day, item.month)}
                                </option>
                        )}
                    </select>
                </div>

                <div className="checkout-form__submit">
                    <button>Place Order</button>
                </div>
            </form>
        </div>
    )
}