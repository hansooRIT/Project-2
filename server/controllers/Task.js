const models = require('../models');

const Task = models.Task;

const makerPage = (req, res) => {
  Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), tasks: docs });
  });
};

const makeTask = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'RAWN! Name is required!' });
  }

  const taskData = {
    name: req.body.name,
    description: req.body.description,
    dueDate: req.body.dueDate,
    overdue: false,
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

const deleteTask = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.delete(req.session.account._id, req.body.deleteName, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ message: 'Task Removed' });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeTask;
module.exports.getTasks = getTasks;
module.exports.deleteTask = deleteTask;
