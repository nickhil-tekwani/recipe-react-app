import React, { useEffect, useState } from "react";
import Favorites from "./RecipeDetails/Favorites"
import { Button, FormControl, Input, InputLabel } from '@mui/material';
import { useAuthToken } from "../AuthTokenContext";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-simple-toasts";
import { AuthTokenProvider } from "../AuthTokenContext";




function Profile() {
  const { user, isLoading } = useAuth0();
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [loc, setLoc] = useState("")
  const [gender, setGender] = useState("")
  const [userprofile, setUserprofile] = useState([]);
  const { accessToken } = useAuthToken();
  useEffect(() => {
    if (!isLoading && accessToken != "")
      fetchProfile();
  }, [accessToken, isLoading])
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }



  // const renderLogin = () => {
  //   if (loggedIn) {
  //     return <UserGreeting username={user.name} />
  //   } else {
  //     return <GuestGreeting />
  //   }
  // }
  async function fetchProfile() {
    const profile = []
    fetch(process.env.REACT_APP_APIENDPOINT + "/profile", {
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
          setName(result.name)
          setAge(result.age)
          setLoc(result.location)
          setGender(result.gender)
        }
      ).then(() => { setUserprofile(profile) })
  }

  async function handleUpdate() {
    const profile = []
    fetch(process.env.REACT_APP_APIENDPOINT + "/profile", {
      method: "PUT",
      withCredentials: true,
      headers: {
        'Authorization': "Bearer " + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": name,
        "gender": gender,
        "age": parseInt(age),
        "location": loc
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
        }
      ).then(() => {
        setUserprofile(profile)
        toast("Profile updated!")
      })
  }


  return (
    <div className="about">
      <div class="container">
        <div class="row align-items-center my-5">
          <h1 class="text-center font-weight-light">Profile</h1>
        </div>
        <div class="row">
          <div class="container">
            <h4>Welcome back {user.name}!</h4>
            <FormControl class="row">
              <div class="col">
                <Input placeholder="Enter New Name" id="change-user" value={name} onChange={(newName) => setName(newName.target.value)}> </Input>
              </div>
              <div class="col">
                <Input type="number" placeholder="Enter New Age" id="change-age" value={age} onChange={(newAge) => setAge(newAge.target.value)}> </Input>
              </div>
              <div class="col">
                <Input placeholder="Enter New Location" id="change-loc" value={loc} onChange={(newLoc) => setLoc(newLoc.target.value)}> </Input>
              </div>
              {/* <div class="col">
            <Input placeholder="Enter New Gender" id="change-gender" value={gender} onChange={(newGender) => setGender(newGender.target.value)}> </Input>
          </div> */}
              <Button onClick={() => handleUpdate()}> UPDATE INFO </Button>
            </FormControl>
          </div>

          <div class="container">
            <Favorites />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
