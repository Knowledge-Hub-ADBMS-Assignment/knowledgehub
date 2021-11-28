const mongoose = require("mongoose");
const topicSchema = new mongoose.Schema(
  {
    topicTitle: {
      type: String,
      maxlength: 50,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uiColor: {
      type: String,
      required: true,
      unique: true
    }
  },
  { versionKey: false }
);

const Topic = mongoose.model("Topic", topicSchema);
const registerTopic = (connection) => {
  return connection.model("Topic", topicSchema);
};

module.exports = {
  topicSchema,
  Topic,
  registerTopic,
};
