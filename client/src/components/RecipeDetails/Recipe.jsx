import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { delay } from '../Utils'
import { Markup } from 'interweave';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { handleFavorite } from '../Utils'
import { Button, FormControl, Input, InputLabel, Rating } from '@mui/material';
import ReviewCard from '../subcomponents/ReviewCard'
import toast from "react-simple-toasts";
import { Link, Navigate, NavLink } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../../AuthTokenContext";


const loggedIn = true;

function Recipe() {
  let { recipeSlug } = useParams();
  const [title, setTitle] = useState("")
  const [imgLink, setImgLink] = useState("")
  const [cuisines, setCuisines] = useState([])
  const [ingredientList, setIngredientList] = useState([])
  const [ints, setInts] = useState("")
  const [rating, setRating] = useState(null)
  const [reviews, setReviews] = useState([])
  const [comment, setComment] = useState("")

  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const { accessToken } = useAuthToken();

  useEffect(() => {
    // dispatch fetch calls for reviews from our api and recipe info from spoonacular
    fetchReviews().catch((error) => console.log(error));
    fetchRecipeInfo().catch((error) => console.log(error));
  }, []);


  const LoginButton = () => {

    return (
      <a href="" onClick={() => loginWithRedirect()}>Login</a>)

  };

  const RegistrationButton = () => {
    return <a href="" onClick={() => loginWithRedirect({
      screen_hint: 'signup',
    })}>Registration</a>
  };

  async function fetchReviews() {

    const newReviews = []
    fetch(process.env.REACT_APP_APIENDPOINT + "/reviews/recipe/" + recipeSlug)
      .then(res => res.json())
      .then(
        (result) => {
          for (let i = 0; i < result.length; i++) {
            const thisReview = result[i];
            // used unshift here to show newer reviews first
            newReviews.unshift((<div className="mt-3"> <ReviewCard id={thisReview.recipeId} createdAt={thisReview.createdAt} name={thisReview.user.name} rating={thisReview.rating} comment={thisReview.comment} /> </div>))
          }
        }
      ).then(() => { setReviews(newReviews) })
  }

  async function postReview() {
    fetch(process.env.REACT_APP_APIENDPOINT + "/reviews", {
      method: "POST",
      withCredentials: true,
      // credentials: "include",
      headers: {
        'Authorization': "Bearer " + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipeId: parseInt(recipeSlug), rating: rating, comment: comment })
    }).then(response => {
      console.log(response);
      window.location = window.location; // force html reload 
    }).catch((error) => console.log(error));
  }

  async function fetchRecipeInfo() {
    let response = await fetch("https://api.spoonacular.com/recipes/" + recipeSlug + "/information?apiKey=" + process.env.REACT_APP_APIKEY)
    let results = await response.json()
    if (results.status === "failure") {
      toast(results.message, 10000)
    } else {
      setTitle(results.title)
      setImgLink(results.image)
      setCuisines(results.cuisines)
      setInts(results.instructions)

      const ingredients = results.extendedIngredients
      for (let i = 0; i < ingredients.length; i++) {
        const thisIng = ingredients[i]
        const thisMsmt = thisIng.measures.metric
        var ingredientString = ""
        if (thisMsmt.unitShort === "") {
          ingredientString = thisMsmt.amount + " " + thisIng.nameClean + "s"
        } else {
          ingredientString = thisMsmt.amount + " " + thisMsmt.unitShort + " of " + thisIng.nameClean
        }
        ingredientList.push(<li> {ingredientString} </li>)
      }
    }
  }



  return (
    <div className="home mb-5">
      <div class="container">
        <h1 className="mt-5 font-weight-light">{title}  </h1>
        <h3 className="mb-3 font-weight-light"> <i> {cuisines.join(" | ")}</i>
          <IconButton aria-label="add to favorites"
            onClick={() => handleFavorite("add",

              {
                "id": recipeSlug,
                "title": title,
                "image": imgLink,
                "cuisine": cuisines.join(" | ")
              }, accessToken)}>
            <FavoriteIcon />
          </IconButton>
        </h3>
        <div class="row align-items-center">
          <img
            class="img-fluid rounded mb-4 mb-lg-0"
            src={imgLink}
            alt={recipeSlug + "img"}
          />
        </div>
        <hr />
        <div class="row">
          <div class="col">
            <h4 className="mt-2 font-weight-light"> Instructions </h4>
            <Markup content={ints} />
          </div>
          <div class="col">
            <h4 className="mt-2 font-weight-light"> Ingredients </h4>
            <p>
              {ingredientList}
            </p>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col">
            <h4 className="mt-2 font-weight-light"> Reviews </h4>
            {reviews}
          </div>
          <div class="col">
            {!isAuthenticated ? <div>
              You are not logged in, please <LoginButton />  or <RegistrationButton />  to review.
            </div> :
              <div class="">
                <h4 className="font-weight-light">Submit New Review:</h4>
                <FormControl class="border p-2">
                  <Rating required name="review" value={rating} onChange={(event, newRating) => { setRating(newRating); }} />
                  <br />
                  <Input labelId="add-comment-label" multiline variant="outline"
                    label="Add Comment" placeholder="Add Comment" id="add-comment" value={comment}
                    onChange={(newValue) => setComment(newValue.target.value)} />
                  <br />
                  <Button onClick={() => { postReview() }}> Submit New Review </Button>
                </FormControl>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recipe;
