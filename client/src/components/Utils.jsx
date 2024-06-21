import toast from 'react-simple-toasts';
export const offeredCuisines = ["American", "Chinese", "European", "Indian", "Italian", "Korean", "Mediterranean", "Vietnamese"];

export const delay = ms => new Promise(res => setTimeout(res, ms));

//
const winLocHref = window.location.href
const loggedIn = true;
// 
async function deleteFavorite(deleteId, accessToken) {
  fetch(process.env.REACT_APP_APIENDPOINT + "/favourites/recipe/" + deleteId, {
    method: "DELETE",
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
        console.log('here')
        window.location = window.location; // force html reload after delay
      }
    ).catch((error) => console.log(error))
}
//
async function addFavorite(recipe, accessToken) {
  fetch(process.env.REACT_APP_APIENDPOINT + "/favourites", {
    method: "POST",
    withCredentials: true,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "recipeId": parseInt(recipe.id),
      "title": recipe.title,
      "image": recipe.image,
      "cuisine": recipe.cuisine
    })
  })
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result)
      }
    ).catch((error) => console.log(error))
}
//
export async function handleFavorite(action, recipe, accessToken) {
  const loginLink = winLocHref.substring(0, winLocHref.length - 7) + "login"
  const profileLink = winLocHref.substring(0, winLocHref.length - 7) + "profile"

  if (action === "add") {
    if (loggedIn) {
      await addFavorite(recipe, accessToken)
      toast("Adding " + recipe.title + " to your favorites. Visit " + profileLink + " to view all favorites.")
    } else {
      toast("You are not logged in! Please navigate to " + loginLink + " to login or register.")
    }

  } else if (action === "remove") {
    await deleteFavorite(recipe.recipeId, accessToken);
  }
}


export const formatDate = (dateString) => {
  const dateOptions = { year: "numeric", month: "long", day: "numeric" }
  const timeOptions = { hour: '2-digit', minute: '2-digit' }
  const dateFinal = new Date(dateString).toLocaleDateString(undefined, dateOptions)
  const timeFinal = new Date(dateString).toLocaleTimeString(undefined, timeOptions)
  return dateFinal + " @ " + timeFinal
}