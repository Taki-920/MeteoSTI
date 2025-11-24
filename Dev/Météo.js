const url = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"

fetch(url)
    .then(reponse => reponse.json())
    .then(data => {
        console.log("Données météo :");
        console.log(data);
    })
    .catch(erreur => console.console.error("Erreur :", erreur));
    
    const datetimeEl = document.getElementById('date-heure');
    const temperatureEl = document.getElementById('temperature');
    const precipitationsEl = document.getElementById('precipitations');
    const etatCielEl = document.getElementById('etat-ciel');
    const ventEl = document.getElementById('vent');
    