// ================================================
// CONTACT MODAL
// ================================================

export function initContactModal() {
	const contactTrigger = document.querySelector("#contact-modal-trigger");
	const contactModal = document.querySelector("#contact-modal");
	const contactCloseButtons = document.querySelectorAll(
		"[data-contact-close]"
	);

	if (!contactTrigger || !contactModal) {
		return;
	}

	const openContactModal = (event) => {
		event.preventDefault();

		contactModal.classList.add("is-open");
		contactModal.setAttribute("aria-hidden", "false");

		document.body.classList.add("contact-modal-open");
	};

	const closeContactModal = () => {
		contactModal.classList.remove("is-open");
		contactModal.setAttribute("aria-hidden", "true");

		document.body.classList.remove("contact-modal-open");
	};

	contactTrigger.addEventListener("click", openContactModal);

	contactCloseButtons.forEach((button) => {
		button.addEventListener("click", closeContactModal);
	});

	document.addEventListener("keydown", (event) => {
		if (
			event.key === "Escape" &&
			contactModal.classList.contains("is-open")
		) {
			closeContactModal();
		}
	});
}