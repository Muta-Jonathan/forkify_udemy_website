import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if(module.hot) {
  module.hot.accept();
}

const showRecipe = async function () {
  try {
    const recipeId = window.location.hash.slice(1);

    if(!recipeId) return;

    // 1) render Spinner
    recipeView.renderSpinner();

    // 2) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    
    // 3) updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    
    // 4) fetching recipe
    await model.loadRecipe(recipeId);
    
    // 5) render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    alert(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) get Search query
    const query = searchView.getQuery();
    
    if(!query) return;
    
    // 2) fetching search
    await model.loadSearchResults(query);

    // 3) render recipe
    resultsView.render(model.getSearchResultsPage());

    // 4) render initial panagination
    paginationView.render(model.state.search);
  } catch (error) {
    
  }
}

const controlPagination = function(goToPage) {
   // 1) render new recipes
   resultsView.render(model.getSearchResultsPage(goToPage));

   // 2) render new panagination btns
   paginationView.render(model.state.search);
}

const contolServings = function(newServings) {
// Update Servings in state
model.updateServings(newServings);

// Update recipe view
// recipeView.render(model.state.recipe);
recipeView.update(model.state.recipe);
}

const contolBookmark = function() {
  // 1) add and remove bookmarks
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update recipe
  recipeView.update(model.state.recipe);

  // 3)render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try {
    // show load spiner
    addRecipeView.renderSpinner();

    // Upload new recipe
    await model.uploadRecipe(newRecipe);

    // Render user added recipeTIMEOUT
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderSuccess();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change url id
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // close form window
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message)
  }
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerUpdateServings(contolServings);
  recipeView.addHandlerAddBookmark(contolBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
}

init();