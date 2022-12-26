import React from "react";
import { Route } from "react-router-dom";
import axios from "axios";

import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites";
import AppContext from "./context";
import Orders from "./pages/Orders";

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
            try {
                setIsLoading(true);

                const [cartResponse, favoriteResponse, itemResponse] =
                    await Promise.all([
                        axios.get(
                            "https://63985dc6044fa481d69abb75.mockapi.io/cart"
                        ),
                        axios.get(
                            "https://63985dc6044fa481d69abb75.mockapi.io/favorites"
                        ),
                        axios.get(
                            "https://63985dc6044fa481d69abb75.mockapi.io/items"
                        ),
                    ]);

                setIsLoading(false);

                setCartItems(cartResponse.data);
                setFavorites(favoriteResponse.data);
                setItems(itemResponse.data);
            } catch (error) {
                alert("Error in fetchData");
                console.log(error);
            }
        }

        fetchData();
    }, []);

    const onAddToCart = async (obj) => {
        try {
            const findItem = cartItems.find(
                (item) => Number(item.parentId) === Number(obj.id)
            );

            if (findItem) {
                setCartItems((prev) =>
                    prev.filter(
                        (item) => Number(item.parentId) !== Number(obj.id)
                    )
                );
                await axios.delete(
                    `https://63985dc6044fa481d69abb75.mockapi.io/cart/${findItem.id}`
                );
            } else {
                setCartItems((prev) => [...prev, obj]);

                const { data } = await axios.post(
                    "https://63985dc6044fa481d69abb75.mockapi.io/cart",
                    obj
                );

                setCartItems((prev) =>
                    prev.map((item) => {
                        if (item.parentId === data.parentId) {
                            return {
                                ...item,
                                id: data.id,
                            };
                        }

                        return item;
                    })
                );
            }
        } catch (error) {
            alert("error in onAddToCart");
            console.log(error);
        }
    };

    const onRemoveItem = async (id) => {
        try {
            setCartItems((prev) =>
                prev.filter((item) => Number(item.id) !== Number(id))
            );
            await axios.delete(
                `https://63985dc6044fa481d69abb75.mockapi.io/cart/${id}`
            );
        } catch (error) {
            alert("error in onRemoveItem ");
            console.log(error);
        }
    };

    const onAddToFavorite = async (obj) => {
        try {
            if (
                favorites.find((favObj) => Number(favObj.id) === Number(obj.id))
            ) {
                setFavorites((prev) =>
                    prev.filter((item) => Number(item.id) !== Number(obj.id))
                );

                await axios.delete(
                    `https://63985dc6044fa481d69abb75.mockapi.io/favorites/${obj.id}`
                );
            } else {
                const { data } = await axios.post(
                    "https://63985dc6044fa481d69abb75.mockapi.io/favorites",
                    obj
                );

                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert("не удалось добавить в фавориты");
            console.log(error);
        }
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    // const isItemAdded = (id) => {
    //     return cartItems.some((obj) => Number(obj.id) === Number(id));
    // };

    const isItemAdded = (id) => {
        return cartItems.some((obj) => Number(obj.parentId) === Number(id));
    };

    const clearInput = () => setSearchValue("");

    return (
        <AppContext.Provider
            value={{
                items,
                cartItems,
                favorites,
                isItemAdded,
                onAddToFavorite,
                onAddToCart,
                setCartOpened,
                setCartItems,
            }}>
            <div className="wrapper clear">
                <Drawer
                    items={cartItems}
                    onClose={() => setCartOpened(false)}
                    onRemove={onRemoveItem}
                    opened={cartOpened}
                />

                <Header onClickCart={() => setCartOpened(true)} />

                <Route
                    path="/"
                    exact>
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
                    exact>
                    <Favorites />
                </Route>

                <Route
                    path="/orders"
                    exact>
                    <Orders />
                </Route>
            </div>
        </AppContext.Provider>
    );
}

export default App;
