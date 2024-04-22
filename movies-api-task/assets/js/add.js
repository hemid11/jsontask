function addRow() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const contactTitle = document.getElementById('contacttitle').value;
    const country = document.getElementById('country').value;

    const tableBody = document.getElementById('booktableBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${tableBody.children.length + 1}</td>
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${contactTitle}</td>
        <td>${country}</td>
    `;
    tableBody.appendChild(newRow);

    const moviesWrapper = document.querySelector('.movies-wrapper');
    const newMovieCard = document.createElement('div');
    newMovieCard.classList.add('col-lg-3', 'col-md-6', 'col-sm-12');
    newMovieCard.innerHTML = `
        <div class="card">
            <div class="card-img">
                <img class="card-img-top" src="./assets/media/default-poster.jpg" alt="${firstName}">
                title="${firstName}"
            </div>
            <div class="card-body">
                <h3 class="card-title">${firstName}</h3>
                <p class="card-text">${lastName}</p>
                <button class="btn btn-outline-primary edit-btn"  data-bs-toggle="modal" data-bs-target="#editModal">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-outline-danger delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    moviesWrapper.appendChild(newMovieCard);

    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('contacttitle').value = '';
    document.getElementById('country').value = '';
}
