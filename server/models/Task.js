const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let TaskModel = {};

const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  dueDate: {
    type: Date,
    required: true,
  },

  overdue: {
    type: Boolean,
    default: false,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

TaskSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  description: doc.description,
  dueDate: doc.dueDate,
  overdue: doc.overdue,
  _id: doc._id,
});

TaskSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return TaskModel.find(search).select('name description dueDate overdue').exec(callback);
};

TaskSchema.statics.delete = (ownerId, taskName, callback) => {
  const search = {
    owner: convertID(ownerId),
    name: taskName,
  };

  return TaskModel.deleteOne(search).exec(callback);
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports.TaskModel = TaskModel;
module.exports.TaskSchema = TaskSchema;
