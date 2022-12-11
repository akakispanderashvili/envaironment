import {Promise} from 'es6-promise'
import './style.css';


let searchBtn: HTMLInputElement | null = document.getElementById("search") as HTMLInputElement;
let searchBtn2: HTMLInputElement | null = document.getElementById("search2") as HTMLInputElement;
let passedYears: HTMLLIElement = <HTMLLIElement>document.getElementById("passedYears");
let actPeople: HTMLLIElement = <HTMLLIElement>document.getElementById("actPeople");
let currency: HTMLLIElement = <HTMLLIElement>document.getElementById("currency");
let sumLength: HTMLHeadingElement = document.getElementById("sumLength") as HTMLHeadingElement;
let sumPopulation: HTMLHeadingElement = document.getElementById("sumPopulation") as HTMLHeadingElement;
let actingPeople: string = "";
let filmingCountries: string[] = [];
let uniqueCountry: string[] = [];
let populationSum:number = 0;
function removeWordsExceptFirst(string:string) {
    let words = string.split(", ");
    let firstWords = [];
    for (let i = 0; i < words.length; i++) {
        let firstWord = words[i].split(" ")[0];
        firstWords.push(firstWord);
    }
    return firstWords.join(", ");
}
interface Currency {
    [key: string]: { name: string; symbol: string };
    }
    
    

function clearCountryItem() {
    const countryFlagElement = document.getElementById('countryFlag');
    if (countryFlagElement) {
    countryFlagElement.remove();
    }
    const currencyElement = document.getElementById('currency');
    if (currencyElement) {
    currencyElement.remove();
    }
    var countryItems = document.querySelectorAll('.new-country-item');
    for (let i = 0; i < countryItems.length; i++) {
        countryItems[i].remove();
    }
}
function createCountryInfo(lowered: string, recievedCurrency: string) {
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
    if (fullpart) {
        const newCountryItem = document.createElement('li');
        fullpart.appendChild(newCountryItem);
        }
        }


    function makeArrOfCountries(filmingCountries: string[]): string[] {
let flattenedArray = (filmingCountries as any).flat(); // using type assertion to access the flat() method
let uniqueCountry: string[] = flattenedArray.filter((el, index) => flattenedArray.indexOf(el) === index);
return uniqueCountry;
}
        
        
        
        




searchBtn.addEventListener("click", () => {
    const movieNameInput = document.getElementById("movie-inp") as HTMLInputElement;
    const movieName: string = movieNameInput.value;
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
                        let recievedCurrency: string = (data[0].currencies as Currency)[0].name;



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




const movie1Input = document.getElementById('movie1') as HTMLInputElement;
const movie2Input = document.getElementById('movie2') as HTMLInputElement;
const movie3Input = document.getElementById('movie3') as HTMLInputElement;

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
