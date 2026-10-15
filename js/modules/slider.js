export function initSlider() {
	const slider = document.getElementById("slider");
	const slides = document.getElementById("slides");

	if (!slider || !slides) return;

	const slideItems = slides.children;
	const totalSlides = slideItems.length;

	let currentSlide = 0;
	let sliderInterval;

	function showSlide(index) {
		currentSlide = (index + totalSlides) % totalSlides;
		slides.style.transform = `translateX(-${currentSlide * 100}%)`;
	}

	function startSlider() {
		clearInterval(sliderInterval);

		sliderInterval = setInterval(() => {
			showSlide(currentSlide + 1);
		}, 5000);
	}

	slider.addEventListener("mouseenter", () => {
		clearInterval(sliderInterval);
	});

	slider.addEventListener("mouseleave", () => {
		startSlider();
	});

	startSlider();
}
