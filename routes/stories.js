const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Story = require("../models/Story");

// @desc Show add page
// @route GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @desc Process add form
// @route POST /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc Show single story page
// @route GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    })
      .populate("user")
      .lean();
    if (!story) {
      return res.render("error/404");
    }
    res.render("stories/show", {
      story,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc Show all public stories page
// @route GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc Show story edit page
// @route GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();

    if (!story) {
      return res.render("error/404");
    }
    res.render("stories/edit", {
      story,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc Update story
// @route PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        // Create new one if doesn't exist
        new: true,
        runValidators: true,
      }
    ).lean();
    if (!story) {
      return res.render("error/404");
    }
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc Delete story
// @route DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!story) {
      return res.render("error/404");
    }
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc Show user stories page
// @route GET /stories/user/:id
router.get("/user/:id", async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.id,
      status: "public",
    })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    if (!stories) {
      return res.render("error/404");
    }
    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;

module.exports = router;

module.exports = router;

module.exports = router;
