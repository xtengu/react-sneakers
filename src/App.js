
import React from "react";
import { Route } from "react-router-dom";
import axios from "axios";

import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites";
import AppContext from "./context";

function App() {
    const [items, setItems] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");
    const [favorites, setFavorites] = React.useState([]);
    const [cartOpened, setCartOpened] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // fetch("https://63985dc6044fa481d69abb75.mockapi.io/items")
        // 	.then((res) => {
        // 		return res.json();
        // 	})
        // 	.then((json) => {
        // 		setItems(json);
        // 	});

        async function fetchData() {
            setIsLoading(true);

            const cartResponse = await axios.get(
                "https://63985dc6044fa481d69abb75.mockapi.io/cart"
            );
            const favoriteResponse = await axios.get(
                "https://63985dc6044fa481d69abb75.mockapi.io/favorites"
            );
            const itemResponse = await axios.get(
                "https://63985dc6044fa481d69abb75.mockapi.io/items"
            );

            setIsLoading(false);

            setCartItems(cartResponse.data);
            setFavorites(favoriteResponse.data);
            setItems(itemResponse.data);
        }

        fetchData();
    }, []);

  
  
  
  
    const onAddToCart = (obj) => {
        if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
            axios.delete(
                `https://63985dc6044fa481d69abb75.mockapi.io/cart/${obj.id}`
            );
            setCartItems((prev) =>
                prev.filter((item) => Number(item.id) !== Number(obj.id))
            );
        } else {
            axios.post("https://63985dc6044fa481d69abb75.mockapi.io/cart", obj);
            setCartItems((prev) => [...prev, obj]);
        }
    };




    const onRemoveItem = (id) => {
        axios.delete(`https://63985dc6044fa481d69abb75.mockapi.io/cart/${id}`);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const onAddToFavorite = async (obj) => {
        try {
            if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
                axios.delete(
                    `https://63985dc6044fa481d69abb75.mockapi.io/favorites/${obj.id}`
                )
                setFavorites((prev)=> prev.filter ((item)=> Number(item.id) !== Number(obj.id)))

            } else {
                const { data } = await axios.post(
                    "https://63985dc6044fa481d69abb75.mockapi.io/favorites",
                    obj
                );
                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert("не удалось добавить в фавориты");
        }
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    
    // const isItemAdded = (id) => {
        //     return cartItems.some((obj) => Number(obj.id) === Number(id));
        // };
        
        const isItemAdded = (id) => {
            return cartItems.some((obj) => Number(obj.id) === Number(id));
    };
    
        const clearInput = () => setSearchValue("");

    return (
        <AppContext.Provider
            value={{ items, cartItems, favorites, isItemAdded, onAddToFavorite ,setCartOpened ,setCartItems}}
        >
            <div className="wrapper clear">
                {cartOpened && (
                    <Drawer
                        items={cartItems}
                        onClose={() => setCartOpened(false)}
                        onRemove={onRemoveItem}
                    />
                )}

                <Header onClickCart={() => setCartOpened(true)} />

                <Route
                    path="/"
                    exact
                >
                    <Home
                        items={items}
                        cartItems={cartItems}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        onChangeSearchInput={onChangeSearchInput}
                        onAddToFavorite={onAddToFavorite}
                        clearInput={clearInput}
                        onAddToCart={onAddToCart}
                        isLoading={isLoading}
                    />
                </Route>

                <Route
                    path="/favorites"
                    exact
                >
                    <Favorites  />
                </Route>
            </div>
        </AppContext.Provider>
    );
}

export default App;
