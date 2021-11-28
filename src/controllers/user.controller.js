const express = require("express");
const router = new express.Router();
const passport = require("passport");
const { createUser, auth,findUserById, updateUser, resetPassword } = require("../services").userService;
const { readAllTopics } = require("../services").topicService;
const { readAllPosts, readAllPostsOfUser } = require("../services").postService;
router.get("/", auth, async (req, res) => {
  try {
    const userName = req.user.firstName + " " + req.user.lastName;
    const user = {userName, _id: req.user._id}
    const topics = await readAllTopics();
    const posts = await readAllPosts();
    if (posts.length > 0) {
      return res.render("pages/home", { user, topics, posts });
    }
    res.render("pages/home", { user, topics, posts: null });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
router.get("/register", async (req, res) => {
  try {
    res.render("pages/register", { error: undefined });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, pswd } = req.body;
    const userCreated = await createUser(firstName, lastName, email, pswd);
    if (!userCreated) {
      return res
        .status(400)
        .render("pages/register", { error: "User Creation failed!" });
    }
    res.render("pages/login", {
      newUser: true,
      message: "your account created successfully",
      lastName: userCreated.lastName,
      failure: false,
    });
  } catch (e) {
    res.status(400).render("pages/register", { error: e.message });
  }
});

router.post('/user/update', auth, async(req, res) => {
  try {
    const {firstName, lastName} = req.body;
    const updated = await updateUser(firstName, lastName, req.user._id);
    if(!updated) {
      return res.render('pages/error', {
        error: 'user not found'
      })
    }
    res.redirect("/user/profile/" + updated._id);
  }catch(e) {
    res.render('pages/error', {
      error: e.message
    })
  }
})

router.get("/login", async (req, res) => {
  try {
    res.render("pages/login", {
      newUser: false,
      failure: req.query.failure === "true" ? true : false,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login?failure=true",
    successRedirect: "/",
  })
);

router.get("/cancel", async (req, res) => {
  res.redirect("/");
});

router.get("/logout", auth, async (req, res) => {
  try {
    req.logout();
    res.redirect("/login");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get('/user/profile/:id',auth, async(req, res) => {
  try {
    const userName = req.user.firstName + " " + req.user.lastName;
    const user = {userName, _id: req.user._id}
    const posts = await readAllPostsOfUser(req.params.id);
    const profileUser = await findUserById(req.params.id);
    if(!profileUser) {
      return res.status(400).render("pages/error", {
        error: "user not found",
      });
    }

    const ownprofile = req.user._id.equals(req.params.id);
    if(posts.length < 1) {
      return res.render("pages/profilepage", {user, posts: null, profileUser, ownprofile});
    }
    res.render("pages/profilepage", { user, posts, profileUser, ownprofile });
    
  } catch (e) {
    res.status(500).send(e.message);
  }
})

router.get("/profileupdateform", auth, async (req, res) => {
  try {
    const {firstName, lastName, _id} = req.user;
    const userName = firstName + " " + lastName;
    const user = { userName, _id, firstName, lastName };
    res.render("pages/updateProfilePage", { user });
  } catch (e) {
    res.status(400).render("pages/error", {
      error: e.message,
    });
  }
});

router.get("/user/reset/password", auth, async (req, res) => {
  try {
    const { firstName, lastName, _id } = req.user;
    const userName = firstName + " " + lastName;
    const user = { userName, _id, firstName, lastName };
    res.render("pages/paswordResetPage", { user });
  } catch (e) {
    res.status(400).render("pages/error", {
      error: e.message,
    });
  }
});

router.post("/user/password/reset", auth, async (req, res) => {
  try {
    const {cpswd, pswd, rpswd} = req.body;
    const resetObj = await resetPassword(cpswd, pswd, rpswd, req.user._id);
    if(resetObj && resetObj.success) {
      return res.redirect('/logout');
    }

    res.status(400).render("pages/error", {
      error: resetObj.message,
    });
  } catch (e) {
    res.status(400).render("pages/error", {
      error: e.message,
    });
  }
});


router.get("/buttons", async (req, res) => {
  try {
    let buttons = [];
    for (i = 0; i < 100; i++) {
      buttons.push(require("../common").color.getRandomColor(150));
    }
    res.render("pages/buttons", {buttons});
  } catch (e) {
    res.status(500).send(e.message);
  }
});
module.exports = router;
