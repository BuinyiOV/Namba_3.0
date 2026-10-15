// Вибір елементів
const languageSwitcher = document.querySelectorAll('.lang-btn');
const plElements = document.querySelectorAll('[data-pl]');
const uaElements = document.querySelectorAll('[data-ua]');

// Функція для зміни мови
export function changeLanguage(lang) {
	const elements = lang === 'pl' ? plElements : uaElements;

	// Оновлення тексту елементів
	elements.forEach(el => {
		el.innerText = el.getAttribute(`data-${lang}`);
	});

	// Відображення активної кнопки
	highlightActiveButton(lang);
}

// Функція для виділення активної кнопки
function highlightActiveButton(activeLang) {
	languageSwitcher.forEach(button => {
		button.classList.remove('active'); // видаляємо клас active з усіх кнопок
	});
	document.getElementById(`${activeLang}-lang`).classList.add('active'); // додаємо клас active до активної кнопки
}

// Ініціалізація подій на кнопки мови
export function initLanguageSwitcher() {
	languageSwitcher.forEach(button => {
		button.addEventListener('click', () => {
			const lang = button.id === 'pl-lang' ? 'pl' : 'ua';
			changeLanguage(lang);
		});
	});
	changeLanguage('pl');
}

//працює