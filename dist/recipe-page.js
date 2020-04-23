const pageMessage = document.getElementById('page-message');
const mainContainer = document.getElementById('container');
const name = document.getElementById('name');
const info = document.getElementById('info');
const image = document.getElementById('thumb');
const ingredientsList = document.getElementById('ing-list');
const youtubeLink = document.getElementById('youtube-link');
const instructions = document.getElementById('instructions');

loadRecipe();

////////////////////////////Helper Functions

function loadRecipe() {
  pageMessage.style.display = 'block';
  pageMessage.innerText =
    'A moment please. Preparing the meal recipe for you...';
  mainContainer.style.display = 'none';

  const recipeID = getParam('recipe_id');
  console.log(recipeID);

  let fetchLink =
    recipeID === 'random'
      ? 'https://www.themealdb.com/api/json/v1/1/random.php'
      : `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeID}`;

  fetch(fetchLink)
    .then((res) => res.json())
    .then((data) => {
      if (data !== null && data.meals !== null && data.meals.length === 1) {
        pageMessage.style.display = 'none';
        mainContainer.style.display = 'block';
        if (recipeID === 'random') replaceRandomWithMealID(data.meals[0]);
        displayRecipe(data.meals[0]);
      } else
        pageMessage.innerText =
          'Oops! Something went wrong. Please check your connection.';
    })
    .catch((error) => {
      pageMessage.innerText =
        'Oops! Something went wrong. Please check your connection.';
      console.log(error);
    });
}

function replaceRandomWithMealID(meal) {
  window.history.replaceState(
    {},
    '',
    `./recipe-page.html?recipe_id=${meal.idMeal}`
  );
}

function displayRecipe(recipe) {
  name.innerText = recipe.strMeal;
  info.innerText = `${recipe.strArea} ${recipe.strCategory}`;

  image.src = recipe.strMealThumb;
  image.alt = recipe.strMeal;

  let ingredients = createFormattedIngredientList(recipe);
  ingredientsList.innerHTML = ingredients
    .map((ing) => `<li>${ing}</li>`)
    .join('');

  youtubeLink.href = recipe.strYoutube;
  instructions.innerHTML = recipe.strInstructions
    .split('\n')
    .map((par) => `<p>${par}</p>`)
    .join('');
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

function getParam(name) {
  if (
    (name = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(
      location.search
    ))
  )
    return decodeURIComponent(name[1]);
}
