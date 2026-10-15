export function initFloatingBg() {
	const floatingBg = document.getElementById("floating-bg");

	if (!floatingBg) {
		return;
	}

	let hasScrolled = false;

	function triggerFloatingBg() {
		if (hasScrolled) {
			return;
		}

		hasScrolled = true;

		// 1. Тряска — 0.9 секунди
		floatingBg.classList.add("shaking");

		// 2. Після тряски починається зникнення
		setTimeout(() => {
			floatingBg.classList.remove("shaking");
			floatingBg.classList.add("disappearing");
		}, 900);

		// 3. Повністю прибираємо після зникнення
		setTimeout(() => {
			floatingBg.style.display = "none";
		}, 1900);
	}


	// Вертикальний скрол сторінки
	window.addEventListener(
		"scroll",
		() => {
			if (window.scrollY > 0) {
				triggerFloatingBg();
			}
		},
		{ passive: true }
	);


	// Горизонтальний скрол меню
	const navLinks = document.querySelector(".nav-links");

	if (navLinks) {
		navLinks.addEventListener(
			"wheel",
			() => {
				triggerFloatingBg();
			},
			{ passive: true }
		);
	}
}