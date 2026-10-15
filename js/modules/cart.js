const CART_STORAGE_KEY = "namba_sushi_cart";

let cart = [];


// ============================================================
// INIT
// ============================================================

export function initCart() {
	loadCart();

	setupCartEvents();
	setupExistingProducts();

	updateCartUI();
}


// ============================================================
// LOCAL STORAGE
// ============================================================

function loadCart() {
	try {
		const savedCart = localStorage.getItem(CART_STORAGE_KEY);

		cart = savedCart ? JSON.parse(savedCart) : [];

		if (!Array.isArray(cart)) {
			cart = [];
		}
	} catch (error) {
		console.error("Nie można wczytać koszyka:", error);
		cart = [];
	}
}


function saveCart() {
	localStorage.setItem(
		CART_STORAGE_KEY,
		JSON.stringify(cart)
	);
}


// ============================================================
// LANGUAGE
// ============================================================

function getLanguage() {
	const lang = document.documentElement.lang;

	if (lang && lang.toLowerCase().startsWith("uk")) {
		return "uk";
	}

	return "pl";
}


function getTexts() {
	if (getLanguage() === "uk") {
		return {
			add: "ДОДАТИ ДО КОШИКА",
			empty: "Кошик порожній",
			total: "Разом",
			remove: "Видалити",
			decrease: "Зменшити кількість",
			increase: "Збільшити кількість"
		};
	}

	return {
		add: "DODAJ DO KOSZYKA",
		empty: "Koszyk jest pusty",
		total: "Razem",
		remove: "Usuń",
		decrease: "Zmniejsz ilość",
		increase: "Zwiększ ilość"
	};
}


// ============================================================
// CATEGORY
// ============================================================

function getCategory() {
	const contentDetails = document.querySelector("#content-details");

	if (contentDetails?.dataset.category) {
		return contentDetails.dataset.category.trim();
	}

	const path = window.location.pathname;

	const match = path.match(
		/\/(?:pl|ua)\/menu\/([^/]+)\.html/i
	);

	if (match) {
		return formatCategoryName(match[1]);
	}

	return "Menu";
}


function formatCategoryName(value) {
	return decodeURIComponent(value)
		.replace(/[-_]+/g, " ")
		.replace(/\b\w/g, letter => letter.toUpperCase());
}


// ============================================================
// PRODUCTS
// ============================================================

function getProducts() {
	const container = document.querySelector("#content-details");

	if (!container) {
		return [];
	}

	const items = container.querySelectorAll("li");

	const products = [];

	items.forEach((item) => {
		const nameElement = item.querySelector(".roll-name");

		if (!nameElement) {
			return;
		}

		const name = getProductName(nameElement);

		if (!name) {
			return;
		}

		const priceElement = nameElement.querySelector("span");

		if (!priceElement) {
			return;
		}

		const price = parsePrice(priceElement.textContent);

		if (price === null) {
			return;
		}

		const ingredientsElement =
			item.querySelector(".roll-ingredients");

		const imageElement =
			item.querySelector(".roll-img");

		const ingredients =
			ingredientsElement?.textContent.trim() || "";

		const image =
			imageElement?.getAttribute("src") || "";

		const category = getCategory();

		const id = createProductId(
			category,
			name
		);

		products.push({
			id,
			category,
			name,
			price,
			ingredients,
			image,
			element: item
		});
	});

	return products;
}


function getProductName(element) {
	const clone = element.cloneNode(true);

	const priceSpan = clone.querySelector("span");

	if (priceSpan) {
		priceSpan.remove();
	}

	return clone.textContent
		.replace(/[-–—]\s*$/, "")
		.trim();
}


function parsePrice(value) {
	if (!value) {
		return null;
	}

	const normalized = value
		.replace(",", ".")
		.replace(/[^\d.]/g, "");

	const price = parseFloat(normalized);

	return Number.isFinite(price)
		? price
		: null;
}


// ============================================================
// PRODUCT ID
// ============================================================

function createProductId(category, name) {
	return `${category}__${name}`
		.toLowerCase()
		.trim();
}


// ============================================================
// PRODUCT CONTROLS
// ============================================================

function setupExistingProducts() {
	const products = getProducts();

	products.forEach((product) => {
		renderProductControls(product);
	});
}


function renderProductControls(product) {
	const item = product.element;

	let controls =
		item.querySelector(".cart-product-controls");

	if (!controls) {
		controls = document.createElement("div");

		controls.className = "cart-product-controls";

		item.appendChild(controls);
	}

	controls.innerHTML = "";

	const cartItem = findCartItem(product.id);

	const texts = getTexts();

	// --------------------------------------------------------
	// PRODUCT NOT IN CART
	// --------------------------------------------------------

	if (!cartItem) {
		const addButton = document.createElement("button");

		addButton.type = "button";
		addButton.className = "cart-add-button";
		addButton.textContent = texts.add;

		addButton.addEventListener("click", () => {
			addToCart(product);
		});

		controls.appendChild(addButton);

		return;
	}


	// --------------------------------------------------------
	// PRODUCT ALREADY IN CART
	// --------------------------------------------------------

	const quantity = cartItem.quantity;

	const decreaseButton = document.createElement("button");

	decreaseButton.type = "button";

	if (quantity === 1) {
		decreaseButton.className =
			"cart-control-button cart-remove-button";

		decreaseButton.innerHTML = "🗑";
		decreaseButton.setAttribute(
			"aria-label",
			texts.remove
		);
	} else {
		decreaseButton.className =
			"cart-control-button cart-minus-button";

		decreaseButton.textContent = "−";
		decreaseButton.setAttribute(
			"aria-label",
			texts.decrease
		);
	}


	decreaseButton.addEventListener("click", () => {
		decreaseQuantity(product.id);
	});


	const quantityElement = document.createElement("span");

	quantityElement.className =
		"cart-product-quantity";

	quantityElement.textContent = quantity;


	const increaseButton = document.createElement("button");

	increaseButton.type = "button";
	increaseButton.className =
		"cart-control-button cart-plus-button";

	increaseButton.textContent = "+";

	increaseButton.setAttribute(
		"aria-label",
		texts.increase
	);


	increaseButton.addEventListener("click", () => {
		increaseQuantity(product.id);
	});


	controls.appendChild(decreaseButton);
	controls.appendChild(quantityElement);
	controls.appendChild(increaseButton);
}


// ============================================================
// ADD TO CART
// ============================================================

function addToCart(product) {
	const existing = findCartItem(product.id);

	if (existing) {
		existing.quantity += 1;
	} else {
		cart.push({
			id: product.id,
			category: product.category,
			name: product.name,
			price: product.price,
			ingredients: product.ingredients,
			image: product.image,
			quantity: 1
		});
	}

	saveCart();
	updateCartUI();
}


// ============================================================
// INCREASE
// ============================================================

function increaseQuantity(productId) {
	const item = findCartItem(productId);

	if (!item) {
		return;
	}

	item.quantity += 1;

	saveCart();
	updateCartUI();
}


// ============================================================
// DECREASE / REMOVE
// ============================================================

function decreaseQuantity(productId) {
	const item = findCartItem(productId);

	if (!item) {
		return;
	}

	if (item.quantity > 1) {
		item.quantity -= 1;
	} else {
		removeFromCart(productId);
		return;
	}

	saveCart();
	updateCartUI();
}


function removeFromCart(productId) {
	cart = cart.filter(
		item => item.id !== productId
	);

	saveCart();
	updateCartUI();
}


// ============================================================
// FIND ITEM
// ============================================================

function findCartItem(productId) {
	return cart.find(
		item => item.id === productId
	);
}


// ============================================================
// CART UI
// ============================================================

function updateCartUI() {
	updateCartCount();
	renderCart();
	updateProducts();
}


function updateProducts() {
	const products = getProducts();

	products.forEach((product) => {
		renderProductControls(product);
	});
}


// ============================================================
// CART COUNT
// ============================================================

function updateCartCount() {
	const countElement =
		document.querySelector("#cart-count");

	if (!countElement) {
		return;
	}

	const totalQuantity = cart.reduce(
		(sum, item) => sum + item.quantity,
		0
	);

	countElement.textContent = totalQuantity;
}


// ============================================================
// CART RENDER
// ============================================================

function renderCart() {
	const cartItemsElement =
		document.querySelector("#cart-items");

	if (!cartItemsElement) {
		return;
	}

	cartItemsElement.innerHTML = "";

	const texts = getTexts();

	if (cart.length === 0) {
		const emptyElement =
			document.createElement("div");

		emptyElement.className = "cart-empty";
		emptyElement.textContent = texts.empty;

		cartItemsElement.appendChild(emptyElement);

		updateCartTotal();

		return;
	}


	// --------------------------------------------------------
	// GROUP BY CATEGORY
	// --------------------------------------------------------

	const groups = {};

	cart.forEach((item) => {
		if (!groups[item.category]) {
			groups[item.category] = [];
		}

		groups[item.category].push(item);
	});


	Object.entries(groups).forEach(
		([category, items]) => {

			const categoryElement =
				document.createElement("div");

			categoryElement.className =
				"cart-category";


			const categoryTitle =
				document.createElement("h3");

			categoryTitle.className =
				"cart-category-title";

			categoryTitle.textContent =
				category;


			categoryElement.appendChild(
				categoryTitle
			);


			const categoryItems =
				document.createElement("div");

			categoryItems.className =
				"cart-category-items";


			items.forEach((item) => {
				const itemElement =
					createCartItemElement(item);

				categoryItems.appendChild(
					itemElement
				);
			});


			categoryElement.appendChild(
				categoryItems
			);

			cartItemsElement.appendChild(
				categoryElement
			);
		}
	);


	updateCartTotal();
}


// ============================================================
// CART ITEM
// ============================================================

function createCartItemElement(item) {
	const element =
		document.createElement("div");

	element.className = "cart-item";


	// --------------------------------------------------------
	// INFO
	// --------------------------------------------------------

	const info =
		document.createElement("div");

	info.className = "cart-item-info";


	const name =
		document.createElement("div");

	name.className = "cart-item-name";
	name.textContent = item.name;


	const price =
		document.createElement("div");

	price.className = "cart-item-price";

	price.textContent =
		`${formatPrice(item.price)} zł`;


	info.appendChild(name);
	info.appendChild(price);


	// --------------------------------------------------------
	// CONTROLS
	// --------------------------------------------------------

	const controls =
		document.createElement("div");

	controls.className =
		"cart-item-controls";


	const decreaseButton =
		document.createElement("button");

	decreaseButton.type = "button";


	if (item.quantity === 1) {
		decreaseButton.className =
			"cart-control-button cart-remove-button";

		decreaseButton.innerHTML = "🗑";

		decreaseButton.setAttribute(
			"aria-label",
			getTexts().remove
		);
	} else {
		decreaseButton.className =
			"cart-control-button cart-minus-button";

		decreaseButton.textContent = "−";

		decreaseButton.setAttribute(
			"aria-label",
			getTexts().decrease
		);
	}


	decreaseButton.addEventListener("click", () => {
		decreaseQuantity(item.id);
	});


	const quantity =
		document.createElement("span");

	quantity.className =
		"cart-item-quantity";

	quantity.textContent =
		item.quantity;


	const increaseButton =
		document.createElement("button");

	increaseButton.type = "button";

	increaseButton.className =
		"cart-control-button cart-plus-button";

	increaseButton.textContent = "+";

	increaseButton.setAttribute(
		"aria-label",
		getTexts().increase
	);


	increaseButton.addEventListener("click", () => {
		increaseQuantity(item.id);
	});


	controls.appendChild(decreaseButton);
	controls.appendChild(quantity);
	controls.appendChild(increaseButton);


	element.appendChild(info);
	element.appendChild(controls);


	return element;
}


// ============================================================
// TOTAL
// ============================================================

function calculateTotal() {
	return cart.reduce(
		(sum, item) => {
			return sum +
				(item.price * item.quantity);
		},
		0
	);
}



function updateCartTotal() {
	const totalElement = document.querySelector("#cart-total");

	if (!totalElement) {
		return;
	}

	const texts = getTexts();

	totalElement.textContent =
		`${texts.total}: ${formatPrice(calculateTotal())} zł`;

	let orderInfo = document.querySelector("#cart-order-info");

	if (!orderInfo) {
		orderInfo = document.createElement("div");
		orderInfo.id = "cart-order-info";
		totalElement.after(orderInfo);
	}

	const lang = document.documentElement.lang;

	if (lang === "uk") {
		orderInfo.innerHTML =
			`Щоб зробити замовлення, будь ласка, зв'яжіться з нами за телефоном:
            <a href="tel:+48792466362">+48 792 466 362</a>`;
	} else if (lang === "pl") {
		orderInfo.innerHTML =
			`Aby złożyć zamówienie, prosimy o kontakt telefoniczny:
            <a href="tel:+48792466362">+48 792 466 362</a>`;
	}
}



// ============================================================
// PRICE
// ============================================================

function formatPrice(price) {
	return Number(price)
		.toFixed(2)
		.replace(".00", "")
		.replace(".", ",");
}


// ============================================================
// CART OPEN / CLOSE
// ============================================================

function setupCartEvents() {
	const toggleButton =
		document.querySelector("#toggle-cart");

	const closeButton =
		document.querySelector("#close-cart");

	const overlay =
		document.querySelector("#cart-overlay");


	if (toggleButton) {
		toggleButton.addEventListener("click", () => {
			openCart();
		});
	}


	if (closeButton) {
		closeButton.addEventListener("click", () => {
			closeCart();
		});
	}


	if (overlay) {
		overlay.addEventListener("click", () => {
			closeCart();
		});
	}


	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeCart();
		}
	});
}


function openCart() {
	const cartContainer =
		document.querySelector("#cart-container");

	const overlay =
		document.querySelector("#cart-overlay");


	if (cartContainer) {
		cartContainer.classList.add("cart-open");
	}

	if (overlay) {
		overlay.classList.add("cart-overlay-open");
	}
}


function closeCart() {
	const cartContainer =
		document.querySelector("#cart-container");

	const overlay =
		document.querySelector("#cart-overlay");


	if (cartContainer) {
		cartContainer.classList.remove("cart-open");
	}

	if (overlay) {
		overlay.classList.remove("cart-overlay-open");
	}
}


// ============================================================
// STORAGE SYNC
// ============================================================

window.addEventListener(
	"storage",
	(event) => {
		if (event.key !== CART_STORAGE_KEY) {
			return;
		}

		loadCart();
		updateCartUI();
	}
);