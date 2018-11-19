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

  isComplete: {
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
  isComplete: doc.isComplete,
  _id: doc._id,
});

TaskSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return TaskModel.find(search).select('name description isComplete').exec(callback);
};

TaskSchema.statics.findCurrentByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
    isComplete: false,
  };

  return TaskModel.find(search).select('name description isComplete').exec(callback);
};

TaskSchema.statics.findCompleteByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
    isComplete: true,
  };
    
  return TaskModel.find(search).select('name description isComplete').exec(callback);
};

TaskSchema.statics.findById = (id, callback) => {
    const search = {
        _id: convertID(id),
    };
    
    return TaskModel.findOne(search, callback);
};

//Simple deletion method for nodes by _id.
TaskSchema.statics.deleteNode = (ownerId, callback) => {
  const search = {
    _id: convertID(ownerId),
  };

  return TaskModel.deleteOne(search).exec(callback);
};

//Finds task by id, then sets their status to complete.
TaskSchema.statics.markAsDone = (id, callback) => {
    TaskModel.findById(id, (err, doc) => {
        if (err) {
            return callback(err);
        }

        if (!doc) {
            return callback();
        }
        doc.set({isComplete: true});
        doc.save((err, doc) => {
            if (err) {
                return callback(err);
            }
            return callback(null, doc);
        });
    });
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports.TaskModel = TaskModel;
module.exports.TaskSchema = TaskSchema;
