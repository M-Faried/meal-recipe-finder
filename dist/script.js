const txtSearchTerm = document.getElementById('txtSearchTerm');
const formSearch = document.getElementById('formSearch');

const btnRandom = document.getElementById('btnRandom');
const btnHome = document.getElementById('btnHome');

const homePage = document.getElementById('homePage');
const searchResultsPage = document.getElementById('searchResultsPage');
const mealPage = document.getElementById('mealPage');

/////////////////////////////////////////////// On Load

formSearch.addEventListener('submit', (e) => {
  e.preventDefault();
  let searchTerm = txtSearchTerm.value;
  if (searchTerm.trim()) {
    displaySearchPageForTerm(searchTerm.trim());
  } else {
    alert('Please enter the meal you are searching for.');
  }
});

btnHome.addEventListener('click', () => {
  showHomePage(true);
  showSearchResultsPage(false);
});

btnRandom.addEventListener(
  'click',
  () => (window.location.href = './recipe-page.html?recipe_id=random')
);

/////////////////////////////////////////////// Helpers

/**
 * Displays the search results for the arg search term.
 * @param {String} term The search term used to search in the meal database.
 */
function displaySearchPageForTerm(term) {
  showHomePage(false);
  showSearchResultsPage(true);

  searchResultsPage.innerHTML =
    '<h1>A moment please. Searching recipes for you...</h1>';

  //Fetching data.
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    .then((res) => res.json())
    .then((data) => {
      if (data == null || data.meals === null || data.meals.length === 0) {
        searchResultsPage.innerHTML =
          "<h1>Oops! Couldn't find any meal matching your search. Please try to search for something else.</h1>";
      } else {
        searchResultsPage.innerHTML = createSearchResultsPage(term, data.meals);
      }
    })
    .catch((error) => {
      searchResultsPage.innerHTML =
        '<h1>Oops! Something went wrong. Please check your connection.</h1>';
      console.log(error);
    });
}

/**
 * Created the search results page.
 * @param {String} term The term used to fetch meals data.
 * @param {Array} meals The meals retrieved from the API.
 */
function createSearchResultsPage(term, meals) {
  return `
    <h2>Displaying recipes for <span class="secondary-color">\'${term}\'</span> :</h2>
    <div class="search-results-container">
      ${meals.map((meal) => createMealCard(meal)).join('')}
    </div>`;
}
/**
 * Formats the meal in the card to be displayed in the search results.
 * @param {} meal The json meal object to create the card for.
 */
function createMealCard(meal) {
  return `
    <div class="meal-card">  
      <a href="./recipe-page.html?recipe_id=${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt"${meal.strMeal}"/> 
        <div class="meal-card-desc">   
          <h2>${meal.strMeal}</h2>
          <h3>( ${meal.strArea} ${meal.strCategory} )</h3>
        </div>       
      </a>
    </div>`;
}

/**
 * Displays or hides the home page.
 * @param {Boolean} show The flag indicating whether to display or hide the page.
 */
function showHomePage(show) {
  if (show) homePage.classList.remove('hide-page');
  else homePage.classList.add('hide-page');
}
/**
 * Displays or hides the search results page.
 * @param {Boolean} show The flag indicating whether to display or hide the page.
 */
function showSearchResultsPage(show) {
  if (show) searchResultsPage.classList.remove('hide-page');
  else searchResultsPage.classList.add('hide-page');
}
