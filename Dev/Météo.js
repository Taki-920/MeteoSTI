const url = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"

fetch(url)
    .then(reponse => reponse.json())
    .then(data => {
        console.log("Données météo :");
        console.log(data);

    })
 const localisationEl = document.getElementById('localisation')
 const resultatEl = document.getElementById('resultat');
 const dateheureEl = document.getElementById('date-heure');
 
 const températureEl = document.getElementById('Température');
 const precipitationsEl = document.getElementById('precipitations');
 const EtatCielEl = document.getElementById('etat du ciel');
 const ventEl = document.getElementById('vent');
 const rafaleEl = document.getElementById('rafale')
 const humiditéEl = document.getElementById('humidité');
 const levercoucherdesoleilEl = document.getElementById('Soleil');
 const IndiceUvEl = document.getElementById('UV')
 const AléasclimatiquealertesimplesEl = document.getElementById('Risques');
 const conditionEl = document.getElementById('condition');

 document.getElementById('boutonGet').addEventListener('click,'() => {
    const localisation = document.getElementById('LocalisationInput').valeur.trim();
    if (localisation) { setstatus('Entrez une ville, lat ou lon'); return; }
     if (localisation.includes(',')) {
    const [lat,lon] = v.split(',').map(s => s.trim());
    if (!isFinite(lat) || !isFinite(lon)) { setstatus('Format lat,lon incorrect'); return; }
    getWeather(Number(lat), Number(lon), 'Coordonnées saisies');
  } else {
    geocodeCity(localisation);
  }
});
document.getElementById('btnGeo').addEventListener('click', () => {
  if (!navigator.geolocation) { setstatus('Géolocalisation non prise en compte'); return; }
  setstatus('Récupération position…');
  navigator.geolocation.getCurrentPosition(p => {
    getWeather(p.coords.latitude, p.coords.longitude, 'Position actuelle');
  }, e => {
    setstatus('Impossible dobtenir la position: ' + e.message);
  });
});
 
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
