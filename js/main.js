/********************************************************************************
 *  WEB422 – Assignment 2
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Renato Cordova
 * Student ID: 15325238
 * Date: 09/27/2024
 *
 *  Published URL: https://web-422-a2-qu75soj87-renfunnys-projects.vercel.app/
 *
 ********************************************************************************/
let page = 1;
let perPage = 10;
let searchName = null;
let url = "";
let tableBody = document.querySelector("#tableBody");
let currentPage = document.querySelector("#current-page");
let previousButton = document.querySelector("#previous-page");
let nextButton = document.querySelector("#next-page");
let modalTitle = document.querySelector(".modal-title");
let modalBody = document.querySelector(".modal-body");
let searchForm = document.querySelector("#searchForm");
let clearButton = document.querySelector("#clearForm");
let dataLength = 0;

let loadListingsData = () => {
  // Loading data from API
  if (searchName) {
    url = `/api/listings?page=${page}&perPage=${perPage}&name=${searchName}`;
  } else {
    url = `/api/listings?page=${page}&perPage=${perPage}`;
  }

  fetch(url)
    .then((res) => {
      return res.ok ? res.json() : Promise.reject(res.status);
    })
    .then((data) => {
      dataLength = data.length;
      if (data.length) {
        tableBody.innerHTML = "";
        data.map((listing) => {
          let row = `<tr data-id="${listing._id}">
            <td>${listing.name}</td>
            <td>${listing.room_type}</td>
            <td>${listing.address.street}</td>
            <td>${listing.summary}
            <br><br>
            <strong>Accommodates: </strong>${listing.accommodates}<br>
            <strong>Rating: </strong>${listing.review_scores.review_scores_rating}
            (${listing.number_of_reviews} Reviews)
            </td>
          </tr>`;
          tableBody.innerHTML += row;
        });

        currentPage.innerHTML = page;

        // Click events for each row
        let rows = tableBody.querySelectorAll("tr");
        rows.forEach((row, index) => {
          row.addEventListener("click", () => {
            let listing = data[index];

            modalTitle.innerHTML = listing.name;
            modalBody.innerHTML = `
            <img id="photo" onerror="this.onerror=null;this.src = 'https://placehold.co/600x400?text=Photo+Not+Available'"  class="img-fluid w-100" src=${listing.images.picture_url}><br><br>
              <p>${listing.neighborhood_overview}</p> <br><br>
              <p><strong>Price:</strong> ${listing.price}</p>
              <p><strong>Room:</strong> ${listing.room_type}</p>
              <p><strong>Bed::</strong> ${listing.bed_type}(${listing.beds})</p>
            `;

            let myModal = new bootstrap.Modal(
              document.getElementById("detailsModal")
            );
            myModal.show();
          });
        });
      } else {
        if (page > 1) {
          page--;
        } else {
          // No data found
          tableBody.innerHTML =
            '<tr><td colspan="4"><strong>No data available</td></tr>';
        }
      }
    })
    .catch((err) => {
      console.error(err);
      console.error("Something went wrong, Data not loaded");
      // Error
      tableBody.innerHTML =
        '<tr><td colspan="4"><strong>Something went wrong</td></tr>';
    });
};

// Event listeners for buttons after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  previousButton.addEventListener("click", () => {
    if (page > 1) {
      page--;
      loadListingsData();
    }
  });

  nextButton.addEventListener("click", () => {
    if (dataLength === perPage) {
      page++;
      loadListingsData();
    }
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchName = document.querySelector("#name").value;
    page = 1;
    loadListingsData();
  });

  clearButton.addEventListener("click", () => {
    searchName = null;
    document.querySelector("#name").value = "";
    page = 1;
    loadListingsData();
  });
});

loadListingsData();
