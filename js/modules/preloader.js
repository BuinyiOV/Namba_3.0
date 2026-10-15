// // =====================================================
// // PRELOADER
// // =====================================================

// export function initPreloader() {
// 	const preloader = document.getElementById("preloader");

// 	if (!preloader) {
// 		return;
// 	}

// 	let isClosed = false;

// 	const closePreloader = () => {
// 		if (isClosed) return;
// 		isClosed = true;

// 		preloader.classList.add("hidden-preloader");

// 		// Повністю прибираємо з DOM після завершення повільної CSS-транзиції (1.4s)
// 		setTimeout(() => {
// 			preloader.style.display = "none";
// 		}, 1400);
// 	};

// 	// Очікуємо готовність структури сайту
// 	document.addEventListener("DOMContentLoaded", () => {
// 		// Даємо 2 секунди, щоб повністю програлася повільна поява літер
// 		setTimeout(closePreloader, 2000);
// 	});

// 	// Аварійний таймер безпеки (якщо зависли важкі ресурси)
// 	setTimeout(closePreloader, 3500);
// }




// =====================================================
// PRELOADER
// =====================================================

export function initPreloader() {
	const preloader = document.getElementById("preloader");

	if (!preloader) {
		return;
	}

	// Перевіряємо, чи сторінка є головною (корінь "/" або файл index.html)
	const isHomePage = window.location.pathname === "/" || window.location.pathname.endsWith("index.html");

	if (!isHomePage) {
		// На інших сторінках вмикаємо швидкий режим (літери з'являться одразу)
		preloader.classList.add("fast-page");
	}

	let isClosed = false;

	const closePreloader = () => {
		if (isClosed) return;
		isClosed = true;

		preloader.classList.add("hidden-preloader");

		// Для головної сторінки вихід триває 1.4с (1400), для інших сторінок — всього 0.4с (400)
		const fadeOutTimeout = isHomePage ? 1400 : 400;

		setTimeout(() => {
			preloader.style.display = "none";
		}, fadeOutTimeout);
	};

	// Очікуємо готовність структури сайту
	document.addEventListener("DOMContentLoaded", () => {
		// На головній сторінці тримаємо 2 секунди для демонстрації появи літер,
		// на внутрішніх сторінках прибираємо прелоадер миттєво після завантаження коду (через 0.1с)
		const waitTime = isHomePage ? 2000 : 100;
		setTimeout(closePreloader, waitTime);
	});

	// Аварійний таймер безпеки (якщо зависли важкі ресурси)
	setTimeout(closePreloader, isHomePage ? 3500 : 1500);
}
