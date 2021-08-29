import Story from "../models/story.model.js";

// add a story
export const addStory = async (req, res) => {
  try {
    if (!req.body) {
      res.status(500).send({ message: "content should not be empty" });
      return;
    }
    const story = {
      title: req.body.title,
      status: req.body.status,
      body: req.body.body,
      user: req.user.id
    };
    await Story.create(story, (err, data) => {
      if (!err) {
        res.status(200).redirect("/dashboard");
      }
    });
  } catch (e) {
    console.log(e);
    res.render("error/500");
  }
};

// edit story
export const editStory = async (req, res) => {
  try {
    await Story.findOne({ _id: req.params.id }, (err, foundStory) => {
      if (foundStory && foundStory.user == req.user.id) {
        foundStory.title = req.body.title;
        foundStory.status = req.body.status;
        foundStory.body = req.body.body;

        foundStory.save();
        res.status(200).redirect("/dashboard");
      } else {
        res.status(500).redirect("error/404");
      }
    });
  } catch (e) {
    console.log(e);
    res.render("error/500");
  }
};

// delete story
export const deleteStory = async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (e) {
    console.log(e);
    res.render("error/500");
  }
};
