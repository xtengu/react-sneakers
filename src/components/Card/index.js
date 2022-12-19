import React from "react";

import styles from "./Card.module.scss";

function Card({
	id,
	imageUrl,
	title,
	price,
	onFavorite,
	onPlus,
	favorited = false,
}) {
	const [isAdded, setIsAdded] = React.useState(false);
	const [isFavorite, setIsFavorite] = React.useState(favorited);

	const onClickPlus = () => {
		onPlus({imageUrl, title, price});
		setIsAdded(!isAdded);
	};

	const onClickFavorite = () => {
		onFavorite({id, imageUrl, title, price});
		setIsFavorite(!isFavorite);
	};

	return (
		<div className={styles.card}>
			<div
				className="favorite"
				onClick={onClickFavorite}>
				<img
					src={isFavorite ? "/img/liked.svg" : "/img/unliked.svg"}
					alt="Unliked"
				/>
			</div>
			<img
				width={133}
				height={112}
				src={imageUrl}
				alt="Sneakers"
			/>
			<h5>{title}</h5>
			<div className="d-flex justify-between align-center">
				<div className="d-flex flex-column">
					<span>Цена:</span>
					<b>{price} руб.</b>
				</div>

				<img
					className={styles.plus}
					onClick={onClickPlus}
					src={isAdded ? "/img/btn-cheked.svg" : "/img/btn-plus.svg"}
					alt="Plus"
				/>
			</div>
		</div>
	);
}

export default Card;
