export function initAnimations() {
	// ================================================
	// ELEMENTS
	// ================================================

	const animatedElements = document.querySelectorAll(
		".content-section, " +
		".roll-menu > li, " +
		".contact-item, " +
		".opening-hours, " +
		".map, " +
		".site-footer"
	);



	// ================================================
	// SCROLL REVEAL
	// ================================================

	if ("IntersectionObserver" in window) {
		const observer = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						return;
					}

					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				});
			},
			{
				threshold: 0.12,
				rootMargin: "0px 0px -50px 0px"
			}
		);

		animatedElements.forEach((element) => {
			element.classList.add("animate-on-scroll");
			observer.observe(element);
		});
	}

	// ================================================
	// MENU CATEGORIES
	// ================================================

	const currentPath = window.location.pathname.replace(/\/$/, "");

	const navLinks = document.querySelectorAll(
		".nav-links a"
	);

	navLinks.forEach((link) => {

		const linkPath = new URL(
			link.href,
			window.location.origin
		).pathname.replace(/\/$/, "");

		if (linkPath === currentPath) {
			link.classList.add("active");
		}

	});

	// ================================================
	// ROLL IMAGE HOVER
	// ================================================

	const rollImages = document.querySelectorAll(
		".roll-img-wrap .roll-img"
	);

	rollImages.forEach((image) => {
		image.addEventListener("mouseenter", () => {
			image.classList.add("image-hover");
		});

		image.addEventListener("mouseleave", () => {
			image.classList.remove("image-hover");
		});
	});
}