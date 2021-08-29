import express from "express";
import { ensureAuth, ensureGuest } from "../middleware/auth.js";
import passport from "passport";
import Story from "../models/story.model.js";
import {
  addStory,
  editStory,
  deleteStory
} from "../controllers/story.controller.js";
const route = express.Router();

// login page
route.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login"
  });
});

// dashboard page
route.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      stories: stories
    });
  } catch (e) {
    console.log(e);
    res.render("error/500");
  }
});

// show add story page
route.get("/stories/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// show edit story page
route.get("/stories/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();

    // if story is found and story is written by the loggedin user then they can proceed.
    if (story && story.user == req.user.id) {
      res.render("stories/edit", {
        story
      });
    } else {
      return res.render("error/404");
    }
  } catch (e) {
    console.log(e);
    res.redirect("error/500");
  }
});

// to get all public stories
route.get("/stories", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", {
      stories
    });
  } catch (e) {
    console.log(e);
    res.render("error/500");
  }
});

// to get single stories
route.get("/stories/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id })
      .populate("user")
      .lean();

    if (!story) {
      return res.render("error/404");
    }

    res.render("stories/show", { story });
  } catch (e) {
    console.log(e);
    res.render("error/500");
  }
});

// to get the User stories
route.get("/stories/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public"
    })
      .populate("user")
      .lean();

    res.render("stories/index", {
      stories
    });
  } catch (e) {
    console.log(e);
    res.render("error/500");
  }
});

////////  API  ///////
// to add stories
route.post("/stories", ensureAuth, addStory);

route.post("/stories/editstory/:id", ensureAuth, editStory);

route.post("/stories/deletestory/:id", ensureAuth, deleteStory);

/* AUTHENTICATIONS */
// auth with google
route.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

// google auth callback
route.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

route.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export default route;
