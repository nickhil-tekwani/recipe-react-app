import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearIcon from '@mui/icons-material/Clear';
import { Link } from "react-router-dom";
import toast from 'react-simple-toasts';
import { handleFavorite } from '../Utils'
import { useAuthToken } from "../../AuthTokenContext";

export default function RecipeReviewCard(props) {
  const winLocHref = window.location.href
  const { accessToken } = useAuthToken();

  // onclick for copy link funcitonality
  function handleCopy() {
    navigator.clipboard.writeText(winLocHref.slice(0, -7) + "details/" + props.recipeId);
    toast("Recipe link for " + props.title + " copied to clipboard!");
  }

  return (
    <Card sx={{ maxWidth: 345 }} id={props.recipeId}>
      <Link to={"/details/" + props.recipeId}>
        <CardHeader
          avatar={
            <Avatar src="https://i.imgur.com/oNBzkfP.png" alt="Online Recipe Book" aria-label="recipe-avatar" />
          }
          title={props.title}
          subheader={props.cuisine}
        />
        <CardMedia
          component="img"
          height="194"
          image={props.image}
          alt={props.cuisine + "_" + props.recipeId}
        />
      </Link>
      <CardActions disableSpacing>

        {props.favoriteButton ? <IconButton aria-label="add to favorites" onClick={() => handleFavorite("add", {
          "id": props.recipeId,
          "title": props.title,
          "image": props.image,
          "cuisine": props.cuisine
        }, accessToken)}><FavoriteIcon /></IconButton> :
          <IconButton aria-label="add to favorites" onClick={() => handleFavorite("remove", { title: props.title, recipeId: props.recipeId }, accessToken)}><ClearIcon /></IconButton>}

        <IconButton aria-label="share" onClick={() => handleCopy()}>
          <ContentCopyIcon />
        </IconButton>

      </CardActions>
    </Card>
  );
}
