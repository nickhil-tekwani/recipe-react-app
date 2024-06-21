import React, { useEffect, useState }from "react";
import RecipeReviewCard from "../subcomponents/RecipeCard.jsx"
import { offeredCuisines, delay } from '../Utils.jsx'
import toast from "react-simple-toasts";


function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [fetchedCuisines, setFetchedCuisines] = useState([]);
  const [recipeCards, setRecipeCards] = useState([]);
  const [showWaiting, setShowWaiting] = useState(true);

  async function fetchRecipes(cuisine) {
    fetch("https://api.spoonacular.com/recipes/complexSearch?cuisine=" + cuisine + "&number=50&apiKey=" + process.env.REACT_APP_APIKEY)
    .then(res => res.json())
    .then(
      (result) => {
        if (result.status === "failure") {
          toast(result.message, 10000)
        } else {
          const theseRecipes = result.results;
          console.log(theseRecipes)
          for (let i = 0; i < theseRecipes.length; i++) {
            const thisRecipe = theseRecipes[i];
            const recipeObj = {}
            recipeObj.recipeId = thisRecipe.id
            recipeObj.title = thisRecipe.title
            recipeObj.image = thisRecipe.image
            recipeObj.cuisine = cuisine
            // catch duplicates from overlapping recipes across cuisines
            if(!recipes.some(r => r.recipeId === recipeObj.recipeId)) {
              recipes.push(recipeObj)
            }
          }
        }
      }
    ).catch((error) => console.log(error))
  } 

  useEffect (() => {
    if (recipeCards.length < 50) {
      console.log('only go here if recipe cards are less than 50')
      for (let i = 0; i < offeredCuisines.length; i++) {
        const thisCuisine = offeredCuisines[i];
        // fixing duplicate issue by keeping track of cuisines we've alr fetched
        if(!fetchedCuisines.includes(thisCuisine)) {
          fetchedCuisines.push(thisCuisine)
          fetchRecipes(thisCuisine)
        }
      }
    }
    
    // 
    const tempCards = [];
    for (let i=0; i < recipes.length; i++) {
      const thisRecipe = recipes[i]
      tempCards.push(
        <div class="col mt-2 mb-2"> 
        <RecipeReviewCard
        recipeId={thisRecipe.recipeId} title={thisRecipe.title} 
        image={thisRecipe.image} cuisine={thisRecipe.cuisine} favoriteButton={true}/> 
        </div>
        )
    }
    delay(500).then(
      () => {setRecipeCards(tempCards); setShowWaiting(false); console.log('set recipe cards');}
    )
  }, [recipeCards])

  return (
    <div className="home">
      <h1 className="text-center mt-5">All Recipes</h1>
      <div class="container">
        <div class="row">
          {showWaiting ? "loading recipes..." : recipeCards}
        </div>
      </div>
    </div>
  );
}

export default Recipes;
