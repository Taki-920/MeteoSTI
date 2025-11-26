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
 
 function weatherCodeToText(code) {
  const map = {
    0: "Ciel dégagé",
    1: "Ensoleillé",
    2: "Partiellement nuageux",
    3: "Très nuageux",
    45: "Brouillard",
    51: "Bruine",
    61: "Pluie légère",
    63: "Pluie modérée",
    65: "Pluie forte",
    71: "Neige faible",
    80: "Averses",
    95: "Orage"
  };
  return map[code] || "Code inconnu";
}