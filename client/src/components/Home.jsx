import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { offeredCuisines } from './Utils.jsx'
import toast from "react-simple-toasts";
import { useAuth0 } from "@auth0/auth0-react";

function Home() {
  const [rotd, setRotd] = useState({});
  const { loginWithRedirect } = useAuth0();

  const LoginButton = () => {

    return (
      <a href="" onClick={() => loginWithRedirect()}>Login</a>)

  };

  const RegistrationButton = () => {
    return <a href="" onClick={() => loginWithRedirect({
      screen_hint: 'signup',
    })}>Registration</a>
  };

  useEffect(() => {
    fetch("https://api.spoonacular.com/recipes/random?number=1&apiKey=" + process.env.REACT_APP_APIKEY)
      .then(res => res.json())
      .then(
        (result) => {
          if (result.status === "failure") {
            toast(result.message, 10000)
          } else {
            const rotdInfo = {};
            const randRecipe = result.recipes[0]
            console.log(randRecipe)
            rotdInfo.title = randRecipe.title
            rotdInfo.recipeId = randRecipe.id
            rotdInfo.image = randRecipe.image
            setRotd(rotdInfo)
          }
        }
      ).catch((error) => console.log(error))
  }, [])

  const cuisineList = [];
  for (let i = 0; i < offeredCuisines.length; i++) {
    const thisCuisine = offeredCuisines[i]
    cuisineList.push(<li> {thisCuisine} </li>)
  }

  return (
    <div className="home">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-5">
            <h1 class="font-weight-light"> Recipe of the Day: <Link to={"/details/" + rotd.recipeId}> {rotd.title} </Link> </h1>
            <img
              class="img-fluid rounded mb-4 mb-lg-0"
              src={rotd.image}
              alt=""
            />
          </div>
          <div class="col-lg-5">
            <h1 class="font-weight-light"><hr /></h1>
            <p>
              Welcome to your one-stop-shop for hundreds of recipes spanning many cuisines. You may browse through many recipes in the Details section across the following cuisines:
              {cuisineList}
              If you would like to save a recipe to your "favorites" list, you will need to <LoginButton /> to your account (or <RegistrationButton />, if you are a first time user).
              <br /> Saved recipes will appear in the <Link to="/profile"> Profile </Link> section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
