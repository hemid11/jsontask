import { getAll, deleteOne, getOne, update } from "./API/requests/index.js";
import { endpoints } from "./API/constants.js";

document.addEventListener("DOMContentLoaded", async () => {
    const moviesWrapper = document.querySelector(".movies-wrapper");
    const editForm = document.querySelector("#edit-form");
    const titleInp = document.querySelector("#title");
    const posterInp = document.querySelector("#poster");
    const trailerURLInp = document.querySelector("#trailerURL");
    const genreInp = document.querySelector("#genre");
    const ageInp = document.querySelector("#age");
    const countryInp = document.querySelector("#country");
    const directorInp = document.querySelector("#director");
    const descTextArea = document.querySelector("#desc");

    const renderAllMovies = async () => {
        const res = await getAll(endpoints.movies);
        renderCards(res.data);
        addWishlistButtons(); 
        setupWishlistButtonListeners();
    };

    const renderCards = (arr) => {
        moviesWrapper.innerHTML = "";
        arr.forEach((movie) => {
            const movieCard = `
                <div class="col-lg-3 col-md-6 col-sm-12" data-id=${movie.id} data-editing="false">
                    <div class="card">
                        <div class="card-img position-relative">
                            <img class="card-img-top" src="${movie.poster}" alt="${movie.title}" title="${movie.title}">
                            <!-- Wishlist Button -->
                            <button class="wishlist-btn btn btn-outline-danger position-absolute bottom-0 end-0 mb-3 me-3" data-movie-id="${movie.id}">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">${movie.title}</h3>
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-outline-secondary mb-0">click for trailer</button> <br>
                                <div class="age-restriction">
                                    <span>${movie.ageRestriction}+</span>
                                </div>
                            </div>
                            <hr>
                            <a href="detail.html?id=${movie.id}" class="btn btn-outline-info info-btn">
                                <i class="fa-solid fa-circle-info"></i>
                            </a>
                            <button class="btn btn-outline-primary edit-btn" data-bs-toggle="modal" data-bs-target="#editModal">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn btn-outline-danger delete-btn">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
            moviesWrapper.innerHTML += movieCard;
        });
        setupEventListeners();
    };

    const setupEventListeners = () => {
        const deleteBtns = document.querySelectorAll(".delete-btn");
        deleteBtns.forEach((btn) => {
            btn.addEventListener("click", async function () {
                const id = this.closest(".col-lg-3").getAttribute("data-id");
                const confirmation = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                });
                if (confirmation.isConfirmed) {
                    const res = await deleteOne(endpoints.movies, id);
                    console.log("delete response: ", res);
                    this.closest(".col-lg-3").remove();
                    await Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success",
                    });
                }
            });
        });

        const editBtns = document.querySelectorAll(".edit-btn");
        editBtns.forEach((btn) => {
            btn.addEventListener("click", async function () {
                const id = this.closest(".col-lg-3").getAttribute("data-id");
                const response = await getOne(endpoints.movies, id);
                const movie = response.data[0];
                titleInp.value = movie.title;
                genreInp.value = movie.genre;
                posterInp.value = movie.poster;
                trailerURLInp.value = movie.trailerURL;
                ageInp.value = movie.ageRestriction;
                countryInp.value = movie.country;
                directorInp.value = movie.director;
                descTextArea.value = movie.description;
                this.closest(".col-lg-3").setAttribute("data-editing", "true");
            });
        });

        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const cards = document.querySelectorAll(".col-lg-3");
            let id;
            Array.from(cards).map((card) => {
                if (card.getAttribute("data-editing") == "true") {
                    id = card.getAttribute("data-id");
                    card.setAttribute("data-editing", "false");
                }
            });

            const updatedMovie = {
                title: titleInp.value,
                genre: genreInp.value,
                country: countryInp.value,
                director: directorInp.value,
                ageRestriction: ageInp.value,
                poster: posterInp.value,
                trailerURL: trailerURLInp.value,
                description: descTextArea.value,
            };
            await update(endpoints.movies, id, updatedMovie);
            await Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Movie Updated Successfully!",
                showConfirmButton: false,
                timer: 1500,
            });
            renderAllMovies();
        });
    };
    
    const addWishlistButtons = () => {
        const movieCards = document.querySelectorAll(".col-lg-3");
        movieCards.forEach(card => {
            const existingWishlistBtns = card.querySelectorAll(".wishlist-btn");
            if (existingWishlistBtns.length > 1) {
                existingWishlistBtns.forEach(btn => {
                    btn.remove();
                });
            } else if (existingWishlistBtns.length === 0) {
                const wishlistBtn = document.createElement("button");
                wishlistBtn.classList.add("wishlist-btn", "btn", "btn-outline-danger", "position-absolute", "bottom-0", "end-0", "mb-3", "me-3");
                wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
                const cardBody = card.querySelector(".card-body");
                cardBody.appendChild(wishlistBtn);
            }
        });
        saveWishlistToLocalStorage();
    };

    const setupWishlistButtonListeners = () => {
        const wishlistBtns = document.querySelectorAll(".wishlist-btn");
        wishlistBtns.forEach(btn => {
            btn.addEventListener("click", async function() {
                const movieId = this.closest(".col-lg-3").dataset.id;
                if (this.classList.contains("wishlist-added")) {
                    console.log("Removed movie with id", movieId, "from wishlist");
                    this.innerHTML = '<i class="far fa-heart"></i>';
                    this.classList.remove("wishlist-added");
                    removeFromWishlist(movieId); 
                } else {
                    console.log("Added movie with id", movieId, "to wishlist");
                    this.innerHTML = '<i class="fas fa-heart"></i>';
                    this.classList.add("wishlist-added");
                    addToWishlist(movieId);
                }
            });
        });
    };

    const saveWishlistToLocalStorage = () => {
        const wishlistItems = document.querySelectorAll(".wishlist-added");
        const wishlistIds = Array.from(wishlistItems).map(item => item.closest(".col-lg-3").dataset.id);
        localStorage.setItem("wishlist", JSON.stringify(wishlistIds));
    };

    const loadWishlistFromLocalStorage = () => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist"));
        if (wishlist) {
            wishlist.forEach(movieId => {
                const btn = document.querySelector(`[data-movie-id="${movieId}"]`);
                if (btn) {
                    btn.classList.add("wishlist-added");
                    btn.innerHTML = '<i class="fas fa-heart"></i>';
                }
            });
        }
    };

    const addToWishlist = (movieId) => {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist.push(movieId);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    };

    const removeFromWishlist = (movieId) => {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist = wishlist.filter(id => id !== movieId);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    };
    loadWishlistFromLocalStorage();
    renderAllMovies();
});
