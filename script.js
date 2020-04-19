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
  showMealPage(false);
});

btnRandom.addEventListener('click', () =>
  fetchAndDisplaySingleMeal(
    'https://www.themealdb.com/api/json/v1/1/random.php'
  )
);

/////////////////////////////////////////////// Helpers

/**
 * Displays the search results for the arg search term.
 * @param {String} term The search term used to search in the meal database.
 */
function displaySearchPageForTerm(term) {
  showHomePage(false);
  showSearchResultsPage(true);
  showMealPage(false);

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
 * Fetches the meal data specified by the arg fetchLink then populates the meal page with data.
 * @param {String} fetchLink The API link which is used to fetch the data of the meal.
 */
function fetchAndDisplaySingleMeal(fetchLink) {
  showHomePage(false);
  showSearchResultsPage(false);
  showMealPage(true);

  mealPage.innerHTML =
    '<h1> A moment please. Preparing the meal for you...</h1>';

  fetch(fetchLink)
    .then((res) => res.json())
    .then((data) => {
      if (data !== null && data.meals !== null && data.meals.length === 1)
        mealPage.innerHTML = createMealPage(data.meals[0]);
      else
        mealPage.innerHTML =
          '<h1> Oops! Something went wrong. Please check your connection.</h1>';
    })
    .catch((error) => {
      mealPage.innerHTML =
        '<h1> Oops! Something went wrong. Please check your connection.</h1>';
      console.log(error);
    });
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
/**
 * Displays or hides the single meal page.
 * @param {Boolean} show The flag indicating whether to display or hide the page.
 */
function showMealPage(show) {
  if (show) mealPage.classList.remove('hide-page');
  else mealPage.classList.add('hide-page');
}

/////////////////////////////////////////////// HTML creator functions

/**
 * Created the search results page.
 * @param {String} term The term used to fetch meals data.
 * @param {Array} meals The meals retrieved from the API.
 */
function createSearchResultsPage(term, meals) {
  return `
    <h2>Displaying results for <span class="secondary-color">\'${term}\'</span> :</h2>
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
  <div class="meal-card" onclick="mealCardClickedHandler(${meal.idMeal})">  
    <img src="${meal.strMealThumb}" alt"${meal.strMeal}"/> 
    <div class="meal-card-desc">   
      <h2>${meal.strMeal}</h2>
      <h3>( ${meal.strArea} ${meal.strCategory} )</h3>
    </div>       
  </div>`;
}
/**
 * The function attached to every meal card displayed in the search page.
 * @param {String} mealID The meal id to fetch the data for..
 */
function mealCardClickedHandler(mealID) {
  fetchAndDisplaySingleMeal(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
}
/**
 * Creates the display page for the meal json object.
 * @param {*} meal The json meal object to create the page for.
 */
function createMealPage(meal) {
  let ingredients = createFormattedIngredientList(meal);
  return `          
    <h1>${meal.strMeal}</h1>
    <h2>${meal.strArea} ${meal.strCategory}</h2>
 
    <div class="meal-image-container">      
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>       
    </div>

    <div>
      <h3>Ingredients:</h3>
      <ul>
        ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
    
    <div>      
      <h3>Instructions: <a href="${
        meal.strYoutube
      }" target="_blank">[WATCH ON YOUTUBE]</a></h3>      
      <p>${meal.strInstructions}</p>
    </div>    
    `;
}
/**
 * Gets a list of ingredients and their measures retreived from the api.
 * @param {} meal
 */
function createFormattedIngredientList(meal) {
  const formattedIngredients = [];
  let item = '';
  let ing = '';
  let measure = '';

  for (let i = 1; i < 31; i++) {
    if (meal[`strIngredient${i}`]) {
      ing = meal[`strIngredient${i}`];
      measure = meal[`strMeasure${i}`];
      item = `${ing}  -  ${measure}`;
      formattedIngredients.push(item);
    } else break;
  }

  return formattedIngredients;
}
