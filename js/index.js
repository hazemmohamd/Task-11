/// <reference types="../@types/jquery" />

let weatherDiv = document.getElementById("weatherDiv")
let inputWord = document.getElementById("inputWord")

const succcess =function(position){
  const latitude=position.coords.latitude
  const longitude=position.coords.longitude
  getGeoData(latitude,longitude)
}
const error =function(error){
  console.log(error);
}
navigator.geolocation.getCurrentPosition(succcess,error)




async function getGeoData(latitude,longitude){
  let response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
  if (response.ok && 400 != response.status) {
      let finalResponse = await response.json();
      let data=finalResponse.locality;
      getData(data);
  }
}


inputWord.addEventListener('keyup', function(){
  getData(inputWord.value);
})

 async function getData(data='cai'){
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=59109c36f7724800a00190748241301&q=${data}&days=3`);
    
    if (response.ok && 400 != response.status) {
        let finalResponse = await response.json();
        let cityName = finalResponse.location;
        let cityDegree = finalResponse.current;
        let forecast = finalResponse.forecast 
        console.log(finalResponse);
        clearDisplay()
        displayCurrent(cityName,cityDegree,forecast)
        displayForecast(forecast) 
    }
    
}

function clearDisplay(){
  weatherDiv.innerHTML =""
}


getData()

let forecastData = []

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


function displayCurrent(id,degree,forecast){
    let currentDate = new Date(degree.last_updated.replace(" ","T"))
    let data =`
    <div class="card mb-3 col-lg-4">
        <div class="card-header firstHeader todayStyle">
            <h5>${days[currentDate.getDay()]}</h5>
            <h5>${currentDate.getDate()} ${month[currentDate.getMonth()]}</h5>
        </div>
        <div class="card-body">
            <div class="secondHeader">
                <h5 class="card-text">${id.name}</h5>
            </div>
            <div class="degreeBody">
                <h5 class="card-text">${degree.temp_c}<sup>o</sup>C</h5>
                <div class="icon">
                    <img src="https:${degree.condition.icon}" alt="" width="90">
                </div>
            </div>
            <h5>${degree.condition.text}</h5>
            <div class="footer">
                <h5>${forecast.forecastday[0].day.daily_chance_of_rain}%</h5>
                <h5>${degree.wind_kph} km/h</h5>
                <h5>${getWindDirection(degree.wind_dir)}</h5>
            </div>
        </div>
    </div>
    `
    weatherDiv.innerHTML = data
}

function displayForecast(forecast){
  let tempForecastData =''
    for(let i = 1; i<forecast.forecastday.length; i++){
        let currentDate = new Date(forecast.forecastday[i].date.replace(" ","T"))
        tempForecastData +=`
        <div class="card mb-3 col-lg-4">
    <div class="card-header firstHeader">
    <h5>${days[currentDate.getDay()]}</h5>
    <h5>${currentDate.getDate()} ${month[currentDate.getMonth()]}</h5>
    </div>
    <div class="card-body forecastStyle">
        <div class="degreeBody forecasting">
            <h5 class="card-text">${forecast.forecastday[i].day.maxtemp_c}<sup>o</sup>C</h5>
            <div class="icon">
                <img src="https:${forecast.forecastday[i].day.condition.icon}" alt="" width="90">
            </div>
        </div>
        <div class="text-center text-capitalize">
            <h5>${forecast.forecastday[i].day.condition.text}</h5>
        </div>
    </div>
</div>
    `
    }
    weatherDiv.innerHTML += tempForecastData
}




function getWindDirection(directionAbbreviation) {
    switch (directionAbbreviation.toLowerCase()) {
      case "n":
        return "North";
      case "ne":
        return "North East";
      case "e":
        return "East";
      case "se":
        return "South East";
      case "s":
        return "South";
      case "sw":
        return "South West";
      case "w":
        return "West";
      case "nw":
        return "North West";
      case "nne":
        return "North-North East";
      case "ene":
        return "East-North East";
      case "ese":
        return "East-South East";
      case "sse":
        return "South-South East";
      case "ssw":
        return "South-South West";
      case "wsw":
        return "West-South West";
      case "wnw":
        return "West-North West";
      case "nnw":
        return "North-North West";
      default:
        return "Unknown";
    }
  }