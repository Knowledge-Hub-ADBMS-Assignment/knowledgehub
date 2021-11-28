const { Topic } = require("../schema").Topic;
const {getRandomColor} = require('../common').color;
const createTopic = async (topicTitle, description, createdBy) => {
  const uiColor = getRandomColor(150);
  const topic = new Topic({ topicTitle, description, createdBy, uiColor });
  await topic.save();
  return topic;
};

const readAllTopics = async() => {
    return await Topic.find({});
}

const readTopicById = async(id) => {
  const topic = await Topic.findById(id).populate({
    path: 'createdBy',
    select: 'firstName lastName'
  });
  return topic;
}

module.exports = { createTopic, readAllTopics, readTopicById };
