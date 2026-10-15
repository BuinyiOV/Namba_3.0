import { initPreloader } from "./js/modules/preloader.js";
import { initCart } from "./js/modules/cart.js";
import { initSlider } from "./js/modules/slider.js";
import { initContactModal } from "./js/modules/contactModal.js";
import { initFloatingBg } from "./js/modules/leaf.js";
import { initAnimations } from "./js/modules/animations.js";
import { initMenuAutoAnimation } from "./js/modules/menuAutoAnimation.js";

initPreloader();
initCart();
initSlider();
initContactModal();
initFloatingBg();
initAnimations();
initMenuAutoAnimation();

// menu

const navLinks = document.querySelector('.nav-links');

if (navLinks) {
	navLinks.addEventListener('wheel', (event) => {
		// Перенаправляємо вертикальний скрол миші у горизонтальний
		event.preventDefault();
		navLinks.scrollLeft += event.deltaY * 1.5; // 1.5 — це швидкість прокрутки
	});
}


// burger

const burgerButton = document.getElementById('burger-button');
const siteHeader = document.querySelector('.site-header');
const categoryNav = document.querySelector('.category-nav');

if (burgerButton && siteHeader) {
	burgerButton.addEventListener('click', function () {
		siteHeader.classList.toggle('menu-open');
		burgerButton.classList.toggle('active');

		const isOpen = siteHeader.classList.contains('menu-open');

		burgerButton.setAttribute(
			'aria-expanded',
			isOpen ? 'true' : 'false'
		);

		if (categoryNav) {
			categoryNav.classList.toggle('hidden', isOpen);
		}
	});
}

// =====================================================
// MENU PARALLAX
// =====================================================

const menuPage = document.querySelector(".menu-page-test");

if (menuPage) {

	window.addEventListener("scroll", () => {

		const scrollY = window.scrollY;

		const movement = scrollY * 0.12;

		menuPage.style.setProperty(
			"--parallax-y",
			`${movement}px`
		);

	});

}


//------------------------------------