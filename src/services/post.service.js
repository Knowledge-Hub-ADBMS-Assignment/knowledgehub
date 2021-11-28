const { Post } = require("./../schema").Post;

const createPost = async (author, title, body, topic) => {
  const newTopic = topic === "Select Topic" ? null : topic;
  const post = new Post({ author, title, body, topic: newTopic });
  await post.save();
  return post;
};

const readAllPosts = async () => {
  const posts = await Post.find({})
    .populate({
      path: "author",
      select: "firstName lastName",
    })
    .populate({
      path: "topic",
    })
    .sort({ createdAt: "desc" });
  return posts;
};

const readAllPostsOfUser = async(author) => {
  const posts = await Post.find({ author })
    .populate({
      path: "author",
      select: "firstName lastName",
    })
    .populate({
      path: "topic",
    })
    .sort({ createdAt: "desc" });
    return posts;
}

const readPostById = async (id) => {
  const post = await Post.findById(id)
    .populate({
      path: "author",
      select: "firstName lastName",
    })
    .populate({
      path: "topic",
      select: "topicTitle description",
    });
  return post;
};

const deletePostById = async(id, author) => {
  const deleted = await Post.findOneAndDelete({_id: id, author});
  return deleted;
}

const updatePost = async(postid, userid, body) => {
  const updated = await Post.findOneAndUpdate({_id: postid, author: userid}, {$set: body}, {returnDocument: 'after'});
  return updated;
}

const findPostsByTopic = async(topic_id) => {
  const posts = await Post.find({ topic: topic_id })
    .populate({
      path: "author",
      select: "firstName lastName",
    })
    .populate({
      path: "topic",
    })
    .sort({ createdAt: "desc" });

    return posts;
}

module.exports = { createPost, findPostsByTopic, readAllPosts, readAllPostsOfUser, readPostById, deletePostById, updatePost };
