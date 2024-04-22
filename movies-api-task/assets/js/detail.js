import API_BASE_URL from "./API/constants.js";
import { endpoints } from "./API/constants.js";
import { getOne } from "./API/requests/index.js";

const id = new URLSearchParams(window.location.search).get('id');
const img = document.querySelector('.card-img-top');
const title  = document.querySelector('.card-title');
const desc = document.querySelector('.movie-desc');
const genre = document.querySelector('#genre');
const country = document.querySelector('#country');
const director = document.querySelector('#director');
const age = document.querySelector('#age');
const goBackBtn = document.querySelector('.go-back-btn');


window.addEventListener('load',()=>{
    getOne(endpoints.movies, id).then((res)=>{
        const movie = res.data[0];
        img.setAttribute('src',movie.poster);
        img.setAttribute('alt',movie.title);
        img.setAttribute('title',movie.title);
        title.textContent = movie.title;
        desc.textContent = movie.description;
        genre.textContent = movie.genre;
        country.textContent = movie.country;
        director.textContent = movie.director;
        age.textContent = movie.ageRestriction;
    })
});


goBackBtn.addEventListener('click',()=>{
    window.history.back();
})