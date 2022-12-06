// import { isToday } from "date-fns";
import './style.css';
let searchBtn = document.getElementById("search");
let searchBtn2 = document.getElementById("search2");
let passedYears = document.getElementById("passedYears");
let actPeople = document.getElementById("actPeople");
let currency = document.getElementById("currency");
let sumLength = document.getElementById("sumLength");
let sumPopulation = document.getElementById("sumPopulation");
let actingPeople = "";
let filmingCountries = [];
let uniqueCountry = [];
let populationSum = 0;
function removeWordsExceptFirst(string) {
    let words = string.split(", ");
    let firstWords = [];
    for (let i = 0; i < words.length; i++) {
        let firstWord = words[i].split(" ")[0];
        firstWords.push(firstWord);
    }
    return firstWords.join(", ");
}

function clearCountryItem() {
    document.getElementById('countryFlag').remove();
    document.getElementById('currency').remove();
    var countryItems = document.querySelectorAll('.new-country-item');
    for (var i = 0; i < countryItems.length; i++) {
        countryItems[i].remove();
    }
}

function createCountryInfo(lowered, recievedCurrency) {
    const fullpart = document.getElementById('full-part3');
    const newCountryItem = document.createElement('div');
    newCountryItem.className = "new-country-item";
    const countryFlag = document.createElement('img');
    countryFlag.id = "countryFlag";
    countryFlag.src = `https://flagcdn.com/${lowered}.svg`;
    countryFlag.className = "flag";
    newCountryItem.appendChild(countryFlag);
    const ul = document.createElement('ul');
    const actPeople = document.createElement('li');
    actPeople.innerHTML = `acting ${actingPeople}`;
    const currency = document.createElement('li');
    currency.id = "currency";
    currency.innerHTML = recievedCurrency;
    ul.appendChild(currency);
    newCountryItem.appendChild(ul);
    fullpart.appendChild(newCountryItem);
}


function makeArrOfCountries() {
    let flattenedArray = filmingCountries.flat();
    uniqueCountry = flattenedArray.filter((el, index) => flattenedArray.indexOf(el) === index);
}




searchBtn.addEventListener("click", () => {
    let movieName = document.getElementById("movie-inp").value;
    let apiKey = "c9fd1f5d";
    let moviesURL = `http://www.omdbapi.com/?apikey=${apiKey}&t=${movieName}`;
    fetch(moviesURL)
        .then((response) => response.json())
        .then((data) => {
            let yearPassed = 2022 - data.Year;
            let actingPeople = removeWordsExceptFirst(data.Actors);
            let countryName = data.Country.split(", ");
            clearCountryItem();
            passedYears.innerHTML = `passed years:${yearPassed}`;
            actPeople.innerHTML = `acting ${actingPeople}`;
            for (let country of countryName) {
                let countriesURL = `https://restcountries.com/v3.1/name/${country}?fullText=true`;
                fetch(countriesURL)
                    .then((response) => response.json())
                    .then((data) => {
                        let upperText = data[0].cca2;
                        let lowered = upperText.toLowerCase();
                        let recievedCurrency = Object.values(data[0].currencies)[0].name;
                        createCountryInfo(lowered, recievedCurrency);
                    })
                    .catch(() => {
                        alert("error, maybe wrond movie name");
                    });
            }
        })
        .catch(() => {
            alert("error, maybe wrong movie name");
        });
});




const movie1Input = document.getElementById('movie1');
const movie2Input = document.getElementById('movie2');
const movie3Input = document.getElementById('movie3');


searchBtn2.addEventListener('click', () => {
    const movie1 = movie1Input.value;
    const movie2 = movie2Input.value;
    const movie3 = movie3Input.value;
    populationSum = 0;
    const movie1Promise = fetch(`http://www.omdbapi.com/?apikey=c9fd1f5d&t=${movie1}`)
        .then(res => res.json());
    const movie2Promise = fetch(`http://www.omdbapi.com/?apikey=c9fd1f5d&t=${movie2}`)
        .then(res => res.json());
    const movie3Promise = fetch(`http://www.omdbapi.com/?apikey=c9fd1f5d&t=${movie3}`)
        .then(res => res.json());

    Promise.all([movie1Promise, movie2Promise, movie3Promise])
        .then(movies => {
            let totalMinutes = 0;
            movies.forEach(movie => {
                const runtime = movie.Runtime;
                filmingCountries.push(movie.Country.split(", "));
                const runtimeSplit = runtime.split(' ');
                const runtimeMinutes = parseInt(runtimeSplit[0]);
                totalMinutes += runtimeMinutes;

            });
            sumLength.innerHTML = `Total length of all movies: ${totalMinutes} minutes`;
            makeArrOfCountries(filmingCountries);
            for (let country of uniqueCountry) {
                let countriesURL = `https://restcountries.com/v3.1/name/${country}?fullText=true`;
                fetch(countriesURL)
                    .then((response) => response.json())
                    .then((data) => {
                        populationSum += data[0].population;
                        sumPopulation.innerHTML = `summed population: ${populationSum}`;
                    })
                    .catch(() => {
                        alert("error, maybe wrond movie name");
                    });

            }

        });
});
