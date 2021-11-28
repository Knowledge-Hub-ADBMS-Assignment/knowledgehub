const mongoose = require("mongoose");
const moment = require("moment");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Topic",
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.index({ title: "text", body: "text" });
postSchema.virtual("created").get(function (value, virtual, doc) {
  return moment(this.createdAt).fromNow();
});

postSchema.virtual("truncated_body").get(function () {
  return this.body.substring(0, 500);
});

const Post = mongoose.model("Post", postSchema);
const registerPost = (connection) => {
  return connection.model("Post", postSchema);
};

module.exports = { Post, registerPost, postSchema };
