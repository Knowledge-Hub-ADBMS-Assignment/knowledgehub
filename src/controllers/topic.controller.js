const express = require("express");
const { auth } = require("../services").userService;
const { createTopic, readAllTopics, readTopicById } = require("../services").topicService;
const {findPostsByTopic} = require("../services").postService;
const router = new express.Router();
router.get("/topics/add", auth, async (req, res) => {
  try {
    const userName = req.user.firstName + " " + req.user.lastName;
    res.render("pages/addTopic", { user: {userName, _id: req.user._id} });
  } catch (e) {
    res.status(400).render("pages/error", { error: e.message });
  }
});

router.get("/topics", auth, async (req, res) => {
  try {
    const {_id} = req.user;
    const userName = req.user.firstName + " " + req.user.lastName;
    const topics = await readAllTopics();
    res.render("pages/all-topics", { user: {userName, _id}, topics });
  } catch (e) {
    res.status(400).render("pages/error", { error: e.message });
  }
});

router.post("/topics", auth, async (req, res) => {
  try {
    const topic = await createTopic(
      req.body.topicTitle,
      req.body.description,
      req.user._id
    );
    if (!topic) {
      res.status(400).render("pages/error", { error: "Topic creation failed" });
    }

    res.redirect("/topics");
  } catch (e) {
    res.status(400).render("pages/error", { error: e.message });
  }
});

router.get('/topics/:id', auth, async(req, res) => {
  try {
    const topic = await readTopicById(req.params.id);
    if(!topic) {
      return res.status(400).render("pages/error", {
        error: 'topic not found',
      });
    }
    const { _id } = req.user;
    const userName = req.user.firstName + " " + req.user.lastName;
    const user = {userName, _id};
    const posts = await findPostsByTopic(req.params.id);
    console.log(posts)
    if(posts.length < 1) {
      return res.render("pages/detailedTopicPage", { user, topic, posts: null });

    }
    res.render('pages/detailedTopicPage', {user, topic, posts});
  }catch(e) {
    res.status(400).render('pages/error', {
      error: e.message
    })
  }
})

module.exports = router;
