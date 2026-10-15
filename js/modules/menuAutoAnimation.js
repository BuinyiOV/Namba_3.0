export function initMenuAutoAnimation() {

	const menuLinks = document.querySelectorAll(
		".menu-page-test__link"
	);

	if (!menuLinks.length) {
		return;
	}


	// ==================================================
	// SETTINGS
	// ==================================================

	// Пауза перед першим запуском
	const START_DELAY = 3000;

	// Інтервал між появою карток
	const SWITCH_TIME = 1500;

	// Максимальна кількість одночасно відкритих
	const MAX_OPEN = 1;

	// Скільки часу картка залишається відкритою
	const DISPLAY_TIME = 4500;

	// Пауза після повного згасання
	const RESTART_DELAY = 20000;


	// ==================================================
	// LOAD IMAGES
	// ==================================================

	menuLinks.forEach((link) => {

		const image = link.dataset.image;

		if (!image) {
			return;
		}

		link.style.setProperty(
			"--menu-image",
			`url("${image}")`
		);
	});


	// ==================================================
	// STATE
	// ==================================================

	let currentIndex = 0;

	let activeLinks = [];

	let isFinishing = false;


	// ==================================================
	// SHOW NEXT CARD
	// ==================================================

	function showNextMenuImage() {

		if (isFinishing) {
			return;
		}


		const currentLink =
			menuLinks[currentIndex];


		// ----------------------------------------------
		// OPEN
		// ----------------------------------------------

		currentLink.classList.add(
			"menu-page-test__link--auto"
		);

		activeLinks.push(currentLink);


		// ----------------------------------------------
		// MAX OPEN
		// ----------------------------------------------

		if (activeLinks.length > MAX_OPEN) {

			const oldestLink =
				activeLinks.shift();

			oldestLink.classList.remove(
				"menu-page-test__link--auto"
			);
		}


		// ----------------------------------------------
		// AUTO CLOSE
		// ----------------------------------------------

		setTimeout(() => {

			currentLink.classList.remove(
				"menu-page-test__link--auto"
			);

			activeLinks =
				activeLinks.filter(
					(link) => link !== currentLink
				);

		}, DISPLAY_TIME);


		// ----------------------------------------------
		// LAST CARD
		// ----------------------------------------------

		if (
			currentIndex ===
			menuLinks.length - 1
		) {

			isFinishing = true;


			// Ждем стандартное время показа
			// последней карточки

			setTimeout(() => {

				// Закрываем всё, что осталось

				activeLinks.forEach((link) => {

					link.classList.remove(
						"menu-page-test__link--auto"
					);

				});

				activeLinks = [];


				// --------------------------------------
				// EMPTY PAUSE
				// --------------------------------------

				setTimeout(() => {

					currentIndex = 0;

					isFinishing = false;

					showNextMenuImage();

				}, RESTART_DELAY);

			}, DISPLAY_TIME);

			return;
		}


		// ----------------------------------------------
		// NEXT
		// ----------------------------------------------

		currentIndex++;


		setTimeout(
			showNextMenuImage,
			SWITCH_TIME
		);
	}


	// ==================================================
	// START
	// ==================================================

	setTimeout(
		showNextMenuImage,
		START_DELAY
	);
}