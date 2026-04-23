const WEATHER_CODES = {
    0: 'Céu limpo',
    1: 'Principalmente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Neblina com geada',
    51: 'Garoa fraca',
    53: 'Garoa moderada',
    55: 'Garoa forte',
    61: 'Chuva fraca',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    71: 'Neve fraca',
    73: 'Neve moderada',
    75: 'Neve forte',
    80: 'Pancadas fracas',
    81: 'Pancadas moderadas',
    82: 'Pancadas fortes',
    95: 'Trovoada'
};

function getElements() {
    return {
        card: document.getElementById('apiCard'),
        status: document.getElementById('weatherStatus'),
        city: document.getElementById('weatherCity'),
        temperature: document.getElementById('weatherTemperature'),
        apparentTemperature: document.getElementById('weatherApparentTemperature'),
        wind: document.getElementById('weatherWind'),
        reloadButton: document.getElementById('reloadWeatherButton')
    };
}

function setLoading(elements) {
    elements.status.textContent = 'Buscando dados...';
    elements.reloadButton.disabled = true;
}

function setReady(elements) {
    elements.reloadButton.disabled = false;
}

function formatTemperature(value) {
    return `${value} °C`;
}

function formatWind(value) {
    return `${value} km/h`;
}

function getStatusFromCode(code) {
    return WEATHER_CODES[code] || 'Clima atualizado';
}

async function fetchWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Erro ao buscar clima');
    }

    const data = await response.json();
    return data.current;
}

async function fetchCityName(latitude, longitude) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

        const response = await fetch(url);

        if (!response.ok) throw new Error();

        const data = await response.json();

        console.log('Nominatim RAW:', data);

        const address = data.address || {};

        const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            'Local desconhecido';

        return {
            name: city,
            admin1: address.state || '',
            country_code: (address.country_code || '').toUpperCase()
        };

    } catch (err) {
        console.error('Erro city:', err);

        return {
            name: 'Sua localização',
            admin1: '',
            country_code: ''
        };
    }
}
function renderWeather(elements, cityData, weatherData) {
    const fullCityName = [
        cityData.name,
        cityData.admin1,
        cityData.country_code
    ].filter(Boolean).join(' - ');

    elements.city.textContent = fullCityName;
    elements.status.textContent = getStatusFromCode(weatherData.weather_code);
    elements.temperature.textContent = formatTemperature(weatherData.temperature_2m);
    elements.apparentTemperature.textContent = formatTemperature(weatherData.apparent_temperature);
    elements.wind.textContent = formatWind(weatherData.wind_speed_10m);
}

function renderError(elements, message) {
    elements.status.textContent = message;
    elements.city.textContent = '--';
    elements.temperature.textContent = '--';
    elements.apparentTemperature.textContent = '--';
    elements.wind.textContent = '--';
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            }),
            () => reject(new Error('Permissão negada'))
        );
    });
}

async function loadWeather() {
    const elements = getElements();

    if (!elements.card) return;

    try {
        setLoading(elements);

        const location = await getUserLocation();

        const weatherData = await fetchWeather(location.latitude, location.longitude);

        const cityData = await fetchCityName(location.latitude, location.longitude);

        console.log('Cidade:', cityData);

        renderWeather(elements, cityData, weatherData);

    } catch (error) {
        console.error(error);
        renderError(elements, 'Erro ao carregar clima');
    } finally {
        setReady(elements);
    }
}

export function initWeather() {
    const elements = getElements();

    if (!elements.card) return;

    loadWeather();

    elements.reloadButton.addEventListener('click', loadWeather);
}