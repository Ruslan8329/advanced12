document
  .querySelector(".searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let searchInput = document.querySelector(".searchInput").value;
    let searchType = document.querySelector(".searchType").value;
    let apiKey = "baa0e2c9";
    let resultsDiv = document.querySelector(".searchResults");
    let btnMore = document.querySelector(".btnMore");

    let page = 1;
    let searchUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
      searchInput
    )}&type=${searchType}`;

    resultsDiv.innerHTML = "";
    btnMore.style.display = "none";

    axios
      .get(`${searchUrl}&page=${page}`)
      .then((response) => {
        if (response.data.Response === "True") {
          displayMovies(response.data.Search.slice(0, 5));
          if (response.data.totalResults > 5) {
            btnMore.style.display = "block";
          }
          page++;
        } else {
          resultsDiv.innerHTML = "Movie not found!";
        }
      })
      .catch((error) => {
        console.error("error", error);
      });

    btnMore.onclick = () => {
      axios
        .get(`${searchUrl}&page=${page}`)
        .then((response) => {
          if (response.data.Response === "True") {
            displayMovies(response.data.Search.slice(0, 5));
            if (response.data.totalResults <= page * 10) {
              btnMore.style.display = "none";
            }
            page++;
          }
        })
        .catch((error) => {
          console.error("Request failed:", error);
        });
    };
  });

function displayMovies(movies) {
  let resultsDiv = document.querySelector(".searchResults");

  movies.forEach((movie) => {
    let title = movie.Title;
    let year = movie.Year;
    let type = movie.Type;
    let poster =
      movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150";

    let movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    movieElement.innerHTML = `
          <h2>${title} (${year})</h2>
          <p>Type: ${type}</p>
          <img src="${poster}" alt="${title}">
      `;

    resultsDiv.appendChild(movieElement);
  });
}
