
function setstatus(txt) {
    const statusEl = document.getElementById('status'); 
    statusEl.innerHTML = `<small>${txt}</small>`;
}


function weatherCodeToText(code) {
    const map = {
        0: "Ciel dégagé / ensoleillé",
        1: "Principalement ensoleillé",
        2: "Partiellement nuageux",
        3: "Couvert / nuageux",
        45: "Brouillard",
        48: "Dépôts givre / brouillard",
        51: "Bruine légère",
        53: "Bruine modérée",
        55: "Bruine dense",
        61: "Pluie légère",
        63: "Pluie modérée",
        65: "Pluie forte",
        71: "Neige faible",
        73: "Neige modérée",
        75: "Neige forte",
        80: "Averses légères",
        81: "Averses modérées",
        82: "Averses violentes",
        95: "Orages",
        96: "Orages avec grêle légère",
        99: "Orages violents avec grêle"
    };
    return map[code] || "Code météo inconnu";
}


function formatTimeLocal(s) {
    try {
        return new Date(s).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return s;
    }
}


async function geocodeCity(city) {
    setstatus("Recherche de la ville…");

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`;

    try {
        const r = await fetch(url);
        const j = await r.json();

        if (!j.results || j.results.length === 0) {
            setstatus("Ville non trouvée");
            return;
        }

        const p = j.results[0];
        getWeather(p.latitude, p.longitude, `${p.name}, ${p.country}`);

    } catch (err) {
        console.error(err);
        setstatus("Erreur de géocodage");
    }
}


async function getWeather(lat, lon, label) {
    setstatus("Récupération météo…");

    const hourlyVars = [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation",
        "precipitation_probability",
        "weather_code",
        "wind_speed_10m",
        "wind_gusts_10m",
        "uv_index"
    ].join(",");

    const dailyVars = [
        "sunrise",
        "sunset",
        "uv_index_max"
    ].join(",");

    const url = 
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&hourly=${hourlyVars}&daily=${dailyVars}` +
        `&current_weather=true&timezone=auto&forecast_days=2`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        
        document.getElementById('localisation').textContent = label;
        document.getElementById('date-heure').textContent =
    new Date().toLocaleString("fr-FR", { timeZone: data.timezone });


        const current = data.current_weather;
        const hourIdx = 0; 

        
        document.getElementById('Température').textContent = current.temperature + " °C";
        document.getElementById('vent').textContent = current.windspeed + " m/s";
        document.getElementById('condition').textContent = weatherCodeToText(current.weathercode);

        document.getElementById('precipitations').textContent = data.hourly.precipitation[hourIdx] + " mm";
        document.getElementById('humidité').textContent = data.hourly.relative_humidity_2m[hourIdx] + " %";
        document.getElementById('rafale').textContent = data.hourly.wind_gusts_10m[hourIdx] + " m/s";

        document.getElementById('UV').textContent = data.daily.uv_index_max[0] ?? data.hourly.uv_index[hourIdx];

        document.getElementById('Soleil').textContent =
            formatTimeLocal(data.daily.sunrise[0]) + " / " +
            formatTimeLocal(data.daily.sunset[0]);

        
        const risques = [];
        if (data.hourly.wind_gusts_10m[hourIdx] >= 25) {
            risques.push(" Rafales très fortes");
        }
        if (data.hourly.uv_index[hourIdx] >= 8) {
            risques.push(" UV très élevés");
        }

        document.getElementById('Risques').innerHTML = risques.length
            ? risques.map(r => `<div class="risque">${r}</div>`).join("")
            : "Aucun risque détecté";

        
        document.getElementById('resultat').style.display = "block";
        setstatus("Météo mise à jour.");

    } catch (err) {
        console.error(err);
        setstatus("Erreur de récupération météo");
    }
}


document.getElementById('boutonGet').addEventListener('click', () => {
    const localisation = document.getElementById('LocalisationInput').value.trim();
    if (!localisation) {
        setstatus('Entrez une ville, lat ou lon');
        return;
    }
    if (localisation.includes(',')) {
        const [lat, lon] = localisation.split(',').map(s => s.trim());
        if (!isFinite(lat) || !isFinite(lon)) {
            setstatus('Format lat,lon incorrect');
            return;
        }
        getWeather(Number(lat), Number(lon), 'Coordonnées saisies');
    } else {
        geocodeCity(localisation);
    }
});


document.getElementById('boutonGeo').addEventListener('click', () => {
    if (!navigator.geolocation) {
        setstatus('Géolocalisation non prise en compte');
        return;
    }
    setstatus('Récupération position…');
    navigator.geolocation.getCurrentPosition(p => {
        getWeather(p.coords.latitude, p.coords.longitude, 'Position actuelle');
    }, e => {
        setstatus('Impossible d\'obtenir la position : ' + e.message);
    });
});
