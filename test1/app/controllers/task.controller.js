const taskService = require('../services/task.service');
const task = require('../models/taskSchema');

function isauthorized(req, res) {
  if (!req.session.data) {
    const message = [{ msg: 'Unautorized User' }];
    res.json(message);
  } else {
    const message = [{ msg: 'Autorized User' }];
    res.json(message);
  };
}

function index(req, res) {
  if (!req.session.data) {
    const message = [{ msg: 'Unautorized User' }];
    res.status(401).json(message);
  } else {
    taskService.findOne({ 'userId': req.session._id }, function(err, data) {
      if (err) {
        const message = 'Unable to pull out data';
        res.status(401).json(message);
      } else {
        // console.log(data);
        res.status(200).json(data.todolist.reverse());
      }
    });
  }
}

function insert(req, res) {
  if (!req.session.data) {
    const message = 'Unautorized User';
    res.status(401).json(message);
  } else {
    if (req.body) {
      console.log(req.session._id);
      taskService.findAndAppend({ 'userId': req.session._id }, req.body, function(err, data) {
        if (err) {
          const message = 'Updating database failed';
          res.status(401).json(message);
        } else {
          res.status(200).json(data.todolist.reverse());
        }
      });
    }
  }
}

function remove(req, res) {
  if (!req.session.data) {
    const message = 'Unautorized User';
    res.status(401).json(message);
  } else {
    if (req.body.task) {
      console.log(req.body);
      taskService.findAndRemove({ 'userId': req.session._id }, req.body, function(err, data) {
        if (err) {
          const message = 'Updating database failed';
          res.status(401).json(message);
        } else {
          res.status(200).json(data.todolist.reverse());
        }
      });
    }
  }
}

function edit(req, res) {
  if (!req.session.data) {
    const message = 'Unautorized User';
    res.status(401).json(message);
  } else {
    if (req.body.task) {
      const editeddata = { task: req.body.task, taskTitle: req.body.taskTitle };
      const index = req.body.index;
      taskService.findOne({ 'userId': req.session._id }, function(err, data) {
        if (err) {
          const message = 'Try after sometime';
          res.status(401).json(message);
        } else {

          const todolist = data.todolist.reverse();
          todolist[req.body.index] = editeddata;
          const temp = todolist.reverse();
          console.log("first", data);
          taskService.findAndUpdate(data._id, temp,
            function(err, doc) {
              if (err) {
                console.log("error sddsds");
                const message = 'Updating database failed';
                res.status(401).json(message);
              } else {
                console.log("Second", data);
                res.status(200).json(data.todolist.reverse());
              }
            });
        }
      });
    }
  }
}

function reorder(req, res) {
  if (!req.session.data) {
    const message = 'Unautorized User';
    res.status(401).json(message);
  } else {
    taskService.findOne({ 'userId': req.session._id }, function(err, data) {
      if (err) {
        const message = 'Try after sometime';
        res.status(401).json(message);
      } else {
        const updatedlist = req.body.reverse();
        taskService.findAndUpdate(data._id, updatedlist,
          function(err, data) {
            if (err) {
              const message = "Updating database failed";
              res.status(401).json(message);
            } else {
              res.status(200).json("sucess");
            }
          });
      }
    });

  }
}

module.exports = {
  isauthorized: isauthorized,
  index: index,
  insert: insert,
  edit: edit,
  reorder: reorder,
  remove: remove
};
