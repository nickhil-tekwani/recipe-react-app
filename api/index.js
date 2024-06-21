import express from "express";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import jwt from "express-jwt";
import jwks from "jwks-rsa";


var requireAuth = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWK_URI,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
});



const app = express();
//const userId = 1;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const prisma = new PrismaClient();

app.get("/ping", (req, res) => {
  res.send("pong");
});

// Review routes


// Create
app.post("/reviews", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  // TODO: Check for duplicate reviews
  const { recipeId, rating, comment } = req.body
  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: 'invalid rating' })
    return;
  } else if (recipeId == null) {
    res.status(400).json({ error: 'invalid recipeId' });
    return;
  }
  try {

    const review = await prisma.review.create({
      data: {
        userId: userId,
        recipeId,
        rating,
        comment
      }
    });
    res.json(review);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: `Unable to create review` })
  }
});

// Get by recipeId
app.get("/reviews/recipe/:id", async (req, res) => {
  const { id } = req.params

  // Validation
  if (isNaN(id)) {
    res.status(400).json({ error: 'invalid id' })
    return;
  }

  try {
    const reviews = await prisma.review.findMany({
      where: {
        recipeId: Number(id),
      },
      include: {
        user: true,
      }
    });

    res.json(reviews);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: `Something went wrong!` })
  }
});


// Get by userId
app.get("/reviews/user", requireAuth, async (req, res) => {
  // const { id } = req.params
  const userId = req.user.sub;
  // Validation


  try {
    const reviews = await prisma.review.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      }
    });
    res.json(reviews);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: `Something went wrong!` })
  }
});


// delete
app.delete("/reviews/:id", requireAuth, async (req, res) => {
  const { id } = req.params
  const userId = req.user.sub;
  // Validation
  if (isNaN(id)) {
    res.status(400).json({ error: 'invalid id' })
    return;
  }

  try {

    const review = await prisma.review.findFirst({
      where: {
        id: Number(id),
        userId: userId,
      },
    });
    console.log(review);
    if (review == null) {
      res.json({
        error: "review not found!"
      });
      return;
    }
    const deletedReview = await prisma.review.delete({
      where: {
        id: Number(id),
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: `Something went wrong!` })
  }
});



// update
app.put("/reviews/:id", requireAuth, async (req, res) => {
  const { id } = req.params
  const userId = req.user.sub;
  // Validation
  if (isNaN(id)) {
    res.status(400).json({ error: 'invalid id' })
    return;
  }

  const { rating, comment } = req.body
  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: 'invalid rating' })
    return;
  }

  try {
    const review = await prisma.review.findFirst({
      where: {
        id: Number(id),
        userId: userId,
      },
    });
    console.log(review);
    if (review == null) {
      res.json({
        error: "review not found!"
      });
      return;
    }
    const updatedReview = await prisma.review.update({
      where: {
        id: Number(id),
      },
      data: {
        rating,
        comment
      },

    });
    res.json(updatedReview);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: `Something went wrong!` })
  }
});


// Favourites routes
app.post("/favourites", requireAuth, async (req, res) => {
  // TODO: Check for duplicate reviews
  const { recipeId, title, image, cuisine } = req.body
  const userId = req.user.sub;

  if (isNaN(recipeId)) {
    res.status(400).json({ error: 'invalid recipeId' })
    return;
  }
  if (title == null || image == null || cuisine == null) {
    res.status(400).json({ error: 'invalid payload' })
    return;
  }
  try {

    const exist = await prisma.favourite.findFirst({
      where: {
        recipeId: recipeId,
        userId: userId,
      },
    });
    console.log(exist);
    if (exist) {
      res.json({
        exist
      });
      return;
    }
    const favourite = await prisma.favourite.create({
      data: {
        userId,
        recipeId,
        title,
        image,
        cuisine
      }
    });
    res.json({
      favourite
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: `Unable to create favourites` })
  }
});



// Get all favourites for user
app.get("/favourites", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  try {
    const favourites = await prisma.favourite.findMany({
      where: {
        userId: userId
      }
    });
    res.json(favourites);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: `Something went wrong!` })
  }
});




app.delete("/favourites/recipe/:id", requireAuth, async (req, res) => {
  const { id } = req.params
  const userId = req.user.sub;
  // Validation
  if (isNaN(id)) {
    res.status(400).json({ error: 'invalid id' })
    return;
  }

  try {
    const favourites = await prisma.favourite.deleteMany({
      where: {
        recipeId: Number(id),
        userId: userId
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: `Something went wrong!` })
  }
});

// Get favourites by id

app.get("/favourites/recipe/:id", requireAuth, async (req, res) => {
  const { id } = req.params
  const userId = req.user.sub;
  // Validation
  if (isNaN(id)) {
    res.status(400).json({ error: 'invalid id' })
    return;
  }

  try {
    const favourite = await prisma.favourite.findFirst({
      where: {
        recipeId: Number(id),
        userId: userId
      }
    });
    if (!favourite) {
      res.json(
        {
          exist: false
        });
      return
    }
    res.json(
      {
        exist: true,
        ...favourite
      });

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: `Something went wrong!` })
  }
});



// User routes
// Get user data
app.get("/profile", requireAuth, async (req, res) => {
  const userId = req.user.sub;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    res.json(user);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: `Something went wrong!` })
  }
});


// update user data
app.put("/profile", requireAuth, async (req, res) => {

  const { username, name, gender, age, location } = req.body
  const userId = req.user.sub;

  if (gender != 'Male' && gender != 'Female') {
    res.status(400).json({ error: 'invalid gender' })
    return
  } else if (age < 5) {
    res.status(400).json({ error: 'invalid age' })
    return
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        username,
        name,
        gender,
        age,
        location
      }
    });
    res.json(user);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: `Something went wrong!` })
  }
});

app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;
  const email = req.user[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.user[`${process.env.AUTH0_AUDIENCE}/name`];
  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (user) {
      res.json(user);
    } else {
      const newUser = await prisma.user.create({
        data: {
          id: auth0Id,
          email,
          auth0Id,
          name,
          username: name
        },
      });

      res.json(newUser);
    }
  }
  catch (error) {
    console.log(error)
    res.status(500).json({ error: `Something went wrong!` })
  }
});



app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});