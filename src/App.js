import React from "react";
import {Route} from "react-router-dom";
import axios from "axios";

import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites";

function App() {
	const [items, setItems] = React.useState([]);
	const [cartItems, setCartItems] = React.useState([]);
	const [searchValue, setSearchValue] = React.useState("");
	const [favorites, setFavorites] = React.useState([]);
	const [cartOpened, setCartOpened] = React.useState(false);

	React.useEffect(() => {
		// fetch("https://63985dc6044fa481d69abb75.mockapi.io/items")
		// 	.then((res) => {
		// 		return res.json();
		// 	})
		// 	.then((json) => {
		// 		setItems(json);
		// 	});

		axios
			.get("https://63985dc6044fa481d69abb75.mockapi.io/items")
			.then((res) => setItems(res.data));
		axios
			.get("https://63985dc6044fa481d69abb75.mockapi.io/cart")
			.then((res) => setCartItems(res.data));
		axios
			.get("https://63985dc6044fa481d69abb75.mockapi.io/favorites")
			.then((res) => setFavorites(res.data));
	}, []);

	const onAddToCart = (obj) => {
		axios.post("https://63985dc6044fa481d69abb75.mockapi.io/cart", obj);
		setCartItems((prev) => [...prev, obj]);
	};

	const onRemoveItem = (id) => {
		axios.delete(`https://63985dc6044fa481d69abb75.mockapi.io/cart/${id}`);
		setCartItems((prev) => prev.filter((item) => item.id !== id));
	};

	const onAddToFavorite = async (obj) => {
		try {
			if (favorites.find((favObj) => favObj.id === obj.id)) {
				axios.delete(
					`https://63985dc6044fa481d69abb75.mockapi.io/favorites/${obj.id}`
				);
			} else {
				const {data} = await axios.post(
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

	const clearInput = () => setSearchValue("");

	return (
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
				exact>
				<Home
					items={items}
					searchValue={searchValue}
					setSearchValue={setSearchValue}
					onChangeSearchInput={onChangeSearchInput}
					onAddToFavorite={onAddToFavorite}
					onAddToCart={onAddToCart}
					clearInput={clearInput}
				/>
			</Route>

			<Route
				path="/favorites"
				exact>
				<Favorites
					items={favorites}
					onAddToFavorite={onAddToFavorite}
				/>
			</Route>
		</div>
	);
}

export default App;
