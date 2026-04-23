import { initWeather } from './modules/weather.js';
import { initForm } from './modules/form.js';
import { initNavigation } from './modules/navigation.js';

function initPortfolio() {
    initWeather();
    initForm();
    initNavigation();
}

document.addEventListener('DOMContentLoaded', initPortfolio);