"use strict";
exports.__esModule = true;
var es6_promise_1 = require("es6-promise");
require("./style.css");
var searchBtn = document.getElementById("search");
var searchBtn2 = document.getElementById("search2");
var passedYears = document.getElementById("passedYears");
var actPeople = document.getElementById("actPeople");
var currency = document.getElementById("currency");
var sumLength = document.getElementById("sumLength");
var sumPopulation = document.getElementById("sumPopulation");
var actingPeople = "";
var filmingCountries = [];
var uniqueCountry = [];
var populationSum = 0;
function removeWordsExceptFirst(string) {
    var words = string.split(", ");
    var firstWords = [];
    for (var i = 0; i < words.length; i++) {
        var firstWord = words[i].split(" ")[0];
        firstWords.push(firstWord);
    }
    return firstWords.join(", ");
}
function clearCountryItem() {
    var countryFlagElement = document.getElementById('countryFlag');
    if (countryFlagElement) {
        countryFlagElement.remove();
    }
    var currencyElement = document.getElementById('currency');
    if (currencyElement) {
        currencyElement.remove();
    }
    var countryItems = document.querySelectorAll('.new-country-item');
    for (var i = 0; i < countryItems.length; i++) {
        countryItems[i].remove();
    }
}
function createCountryInfo(lowered, recievedCurrency) {
    var fullpart = document.getElementById('full-part3');
    var newCountryItem = document.createElement('div');
    newCountryItem.className = "new-country-item";
    var countryFlag = document.createElement('img');
    countryFlag.id = "countryFlag";
    countryFlag.src = "https://flagcdn.com/".concat(lowered, ".svg");
    countryFlag.className = "flag";
    newCountryItem.appendChild(countryFlag);
    var ul = document.createElement('ul');
    var actPeople = document.createElement('li');
    actPeople.innerHTML = "acting ".concat(actingPeople);
    var currency = document.createElement('li');
    currency.id = "currency";
    currency.innerHTML = recievedCurrency;
    ul.appendChild(currency);
    newCountryItem.appendChild(ul);
    if (fullpart) {
        var newCountryItem_1 = document.createElement('li');
        fullpart.appendChild(newCountryItem_1);
    }
}
function makeArrOfCountries(filmingCountries) {
    var flattenedArray = filmingCountries.flat(); // using type assertion to access the flat() method
    var uniqueCountry = flattenedArray.filter(function (el, index) { return flattenedArray.indexOf(el) === index; });
    return uniqueCountry;
}
searchBtn.addEventListener("click", function () {
    var movieNameInput = document.getElementById("movie-inp");
    var movieName = movieNameInput.value;
    var apiKey = "c9fd1f5d";
    var moviesURL = "http://www.omdbapi.com/?apikey=".concat(apiKey, "&t=").concat(movieName);
    fetch(moviesURL)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var yearPassed = 2022 - data.Year;
        var actingPeople = removeWordsExceptFirst(data.Actors);
        var countryName = data.Country.split(", ");
        clearCountryItem();
        passedYears.innerHTML = "passed years:".concat(yearPassed);
        actPeople.innerHTML = "acting ".concat(actingPeople);
        for (var _i = 0, countryName_1 = countryName; _i < countryName_1.length; _i++) {
            var country = countryName_1[_i];
            var countriesURL = "https://restcountries.com/v3.1/name/".concat(country, "?fullText=true");
            fetch(countriesURL)
                .then(function (response) { return response.json(); })
                .then(function (data) {
                var upperText = data[0].cca2;
                var lowered = upperText.toLowerCase();
                var recievedCurrency = data[0].currencies[0].name;
            })["catch"](function () {
                alert("error, maybe wrond movie name");
            });
        }
    })["catch"](function () {
        alert("error, maybe wrong movie name");
    });
});
var movie1Input = document.getElementById('movie1');
var movie2Input = document.getElementById('movie2');
var movie3Input = document.getElementById('movie3');
searchBtn2.addEventListener('click', function () {
    var movie1 = movie1Input.value;
    var movie2 = movie2Input.value;
    var movie3 = movie3Input.value;
    populationSum = 0;
    var movie1Promise = fetch("http://www.omdbapi.com/?apikey=c9fd1f5d&t=".concat(movie1))
        .then(function (res) { return res.json(); });
    var movie2Promise = fetch("http://www.omdbapi.com/?apikey=c9fd1f5d&t=".concat(movie2))
        .then(function (res) { return res.json(); });
    var movie3Promise = fetch("http://www.omdbapi.com/?apikey=c9fd1f5d&t=".concat(movie3))
        .then(function (res) { return res.json(); });
    es6_promise_1.Promise.all([movie1Promise, movie2Promise, movie3Promise])
        .then(function (movies) {
        var totalMinutes = 0;
        movies.forEach(function (movie) {
            var runtime = movie.Runtime;
            filmingCountries.push(movie.Country.split(", "));
            var runtimeSplit = runtime.split(' ');
            var runtimeMinutes = parseInt(runtimeSplit[0]);
            totalMinutes += runtimeMinutes;
        });
        sumLength.innerHTML = "Total length of all movies: ".concat(totalMinutes, " minutes");
        makeArrOfCountries(filmingCountries);
        for (var _i = 0, uniqueCountry_1 = uniqueCountry; _i < uniqueCountry_1.length; _i++) {
            var country = uniqueCountry_1[_i];
            var countriesURL = "https://restcountries.com/v3.1/name/".concat(country, "?fullText=true");
            fetch(countriesURL)
                .then(function (response) { return response.json(); })
                .then(function (data) {
                populationSum += data[0].population;
                sumPopulation.innerHTML = "summed population: ".concat(populationSum);
            })["catch"](function () {
                alert("error, maybe wrond movie name");
            });
        }
    });
});
