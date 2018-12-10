const models = require('../models');

const Task = models.Task;

// Method to render the main app page. First needs to
// find all tasks that belong to the user and return that as well to render.
const makerPage = (req, res) => {
  Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), tasks: docs });
  });
};

// Method to create a task. Creates a json object
// of the provided data, then saves that to the database.
const makeTask = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'RAWN! Name is required!' });
  }

  const taskData = {
    name: req.body.name,
    description: req.body.description,
    isComplete: req.body.isComplete,
    owner: req.session.account._id,
  };

  const newTask = new Task.TaskModel(taskData);

  const taskPromise = newTask.save();

  taskPromise.then(() => res.json({ redirect: '/maker' }));

  taskPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Task already exists.' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });

  return taskPromise;
};

// Method to retrieve the account's tasks.
// Calls method in TaskModel to find all
// tasks that belong to this account, then return it as a json object.
const getTasks = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ tasks: docs });
  });
};

// Method to retrieve the account's tasks that are marked as current.
// Returns a json object of all current tasks.
const getCurrentTasks = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.findCurrentByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ tasks: docs });
  });
};

// Method to retrieve the account's tasks that are marked as completed.
// Returns a json object of all completed tasks.
const getCompletedTasks = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.findCompleteByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ tasks: docs });
  });
};

// Method to retrieve another account's tasklist.
// Returns a json object of all of the other user's tasks.
const getFriendTasks = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.findByOwner(req.query._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ tasks: docs });
  });
};

// Method to delete a task.
// Sends data regarding the task to the model, and the model removes that task from the database.
const deleteNode = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.deleteNode(req.body._id, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ message: 'Task Removed' });
  });
};

// Method to set a task as complete.
// Retrieves the specified database entry and sets its completion to true.
const completeNode = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.markAsDone(req.body._id, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ redirect: '/maker' });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeTask;
module.exports.getTasks = getTasks;
module.exports.getCurrentTasks = getCurrentTasks;
module.exports.getCompletedTasks = getCompletedTasks;
module.exports.getFriendTasks = getFriendTasks;
module.exports.deleteNode = deleteNode;
module.exports.completeNode = completeNode;
