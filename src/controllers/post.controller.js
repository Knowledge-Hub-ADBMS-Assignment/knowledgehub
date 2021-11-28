const express = require("express");
const { auth } = require("../services").userService;
const { createPost, readAllPosts, readPostById, deletePostById, updatePost } =
  require("../services").postService;
const {readAllTopics} = require('../services').topicService;
const router = new express.Router();

router.post("/posts", auth, async (req, res) => {
  try {
    const { title, body, topic } = req.body;
    console.log(topic);
    const post = await createPost(req.user._id, title, body, topic);
    if (!post) {
      return res.status(400).render("pages/error", {
        error: "unable post right now, please check all deatails are valid",
      });
    }
    res.redirect("/");
  } catch (e) {
    return res.status(400).render("pages/error", {
      error: e.message,
    });
  }
});

router.get("/posts/:id", auth, async (req, res) => {
  try {
    const post = await readPostById(req.params.id);
    if (!post) {
      return res.status(400).render("pages/error", {
        error: "post not found",
      });
    }
    const userName = req.user.firstName + " " + req.user.lastName;
    const user = {userName, _id: req.user._id};
    res.render("pages/detailedPostPage", {
      user,
      post,
      isMyPost: post.author._id.equals(req.user._id),
    });
  } catch (e) {
    return res.status(400).render("pages/error", {
      error: e.message,
    });
  }
});

router.get("/posts/delete/:id", auth, async (req, res) => {
  try {
    const post = await deletePostById(req.params.id, req.user._id);
    if (!post) {
      return res.status(400).render("pages/error", {
        error: "post not found",
      });
    }
    res.redirect('/');
  } catch (e) {
    return res.status(400).render("pages/error", {
      error: e.message,
    });
  }
});

router.get("/posts/update/:id", auth, async (req, res) => {
  try {
    const userName = req.user.firstName + " " + req.user.lastName;
    const topics = await readAllTopics();
    const post = await readPostById(req.params.id);
    if(!post) {
      return res.status(400).render("pages/error", {
        error: "post not found",
      });
    }
    res.render("pages/updatePostPage", {user: {userName, _id: req.user._id}, topics, post});
  } catch (e) {
    return res.status(400).render("pages/error", {
      error: e.message,
    });
  }
});

router.post("/posts/update/:id", auth, async (req, res) => {
  try {
    const updated = await updatePost(req.params.id, req.user._id, req.body);
    if (!updated) {
      return res.status(404).render("pages/error", {
        error: "update failed, post not found",
      });
    }
    res.redirect("/posts/" + updated._id);
  } catch (e) {
    return res.status(400).render("pages/error", {
      error: e.message,
    });
  }
});
module.exports = router;
