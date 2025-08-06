import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { shops } from "../../const/Shops";

// const containerStyle = {
//   width: "100%",
//   aspectRatio: "2 / 1"
// };

const center = {
  lat: 50.50, 
  lng: 30.55
};

const onClickHandler = (id: number) => {
  console.log('marker', id);
}

export const ShopMap = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAiMj8LpcyUZKN1JuBTRV7d1tVgkcZcJC8">
      <GoogleMap mapContainerClassName="contacts-info__map-contanier" center={center} zoom={11}>
        {shops.map( item => 
          <Marker 
            key={item.id} 
            position={item.position} 
            label={ {text: item.id.toString()} } 
            onClick={() => onClickHandler(item.id)}/>
        )}
      </GoogleMap>
    </LoadScript>
  );
};