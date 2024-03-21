import { createContext, useState } from "react";

const RestaurantContext = createContext({});

export const RestaurantData = ({children}) => {

    const [itemsSelected, setItemsSelected] = useState([]);

    const [noOfOffers, setNoOfOffers] = useState("");



    return (
        <RestaurantContext.Provider value={{itemsSelected, setItemsSelected, noOfOffers, setNoOfOffers}}>
          {children}
        </RestaurantContext.Provider>
      );

   
}

export default RestaurantContext;
