import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookMarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) module.hot.accept();

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    //loading recipe
    recipeView.renderSpinner();
    await model.loadRecipe(id);

    //rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    //get search query from the serch input
    const query = searchView.getQuery();
    if (!query) return;

    //load search result
    resultsView.renderSpinner();
    await model.loadSearchResult(query);

    //renderResult
    resultsView.render(model.getSearchResultPage(1));

    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //render the next results
  resultsView.render(model.getSearchResultPage(goToPage));

  //render the next buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  recipeView.render(model.state.recipe);
};

const controlAddBookMark = function () {
  //  add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);
  recipeView.render(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookMarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success mesage
    addRecipeView.renderMessage(addRecipeView._message);

    //render bookmark view
    bookmarksView.render(model.state.bookMarks);

    //change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow(), 2500;
    });
  } catch (err) {
    console.error('😀', err);
    addRecipeView.renderError(err.message);
  }

  // upload the new recipe data
};

const init = function () {
  bookmarksView.addhandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
