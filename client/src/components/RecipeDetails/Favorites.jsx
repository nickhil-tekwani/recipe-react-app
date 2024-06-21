import React, { useEffect, useState } from "react";
import RecipeReviewCard from "../subcomponents/RecipeCard.jsx"
import { useAuthToken } from "../../AuthTokenContext";
function Favorites(props) {
  const [favorites, setFavorites] = useState([]);
  const { accessToken } = useAuthToken();


  useEffect(() => {
    async function fetchFavorites() {
      const newFavorites = []
      fetch(process.env.REACT_APP_APIENDPOINT + "/favourites", {
        method: "GET",
        withCredentials: true,
        headers: {
          'Authorization': "Bearer " + accessToken,
          'Content-Type': 'application/json'
        },
      })
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result)
            for (let i = 0; i < result.length; i++) {
              const thisRecipe = result[i];
              newFavorites.push((
                <div class={"col mt-2 mb-2"}>
                  <RecipeReviewCard
                    recipeId={thisRecipe.recipeId} title={thisRecipe.title}
                    image={thisRecipe.image} cuisine={thisRecipe.cuisine} favoriteButton={false} />
                </div>
              ))
            }
          }
        ).then(() => { setFavorites(newFavorites) })
    }
    if (accessToken != "") {
      fetchFavorites();
    }

  }, [accessToken])

  return (
    <div className="home">
      <h5 className="text-center mt-5">Your Favorite Recipes</h5>
      <div class="container">
        <div class="row justify-content-center">
          {favorites}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
