'use strict';


module.exports = function (app) {

  const mongoose = require('mongoose')
  mongoose.connect(process.env.Mongo);

  const Schema = mongoose.Schema;

  const recordSchema = new Schema(
    {
      project_name: { type: String },
      assigned_to: { type: String },
      status_text: { type: String },
      open: { type: Boolean },
      issue_title: { type: String },
      issue_text: { type: String },
      created_by: { type: String },
      created_on: { type: Date },
      updated_on: { type: Date }
    });


  const Record = mongoose.model("Record", recordSchema)


  app.route('/api/issues/:project/')

    .get(function (req, res) {
      let project = req.params.project;


      Record.find({ ...req.query, project_name: project })
        .then(function (models) {

          var i;
          var ret_array = models
          for (i = 0; i < ret_array.length; i++) {
            ret_array[i].project_name = undefined;
            ret_array[i].__v = undefined;
          }

          res.send(ret_array)
        })
        .catch(function (err) {
          console.log(err)
        });


      console.log("get", req.query)
    })


    .post(function (req, res) {

      let project = req.params.project;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to;
      let status_text = req.body.status_text;

      if (status_text == undefined) {
        status_text = ""
      }

      if (assigned_to == undefined) {
        assigned_to = ""
      }

      if (issue_title == null || issue_text == null || created_by == null) {
        res.send({ error: 'required field(s) missing' })
      } else {

        var new_record = new Record
          ({
            project_name: project,
            assigned_to: assigned_to,
            status_text: status_text,
            open: true,
            issue_title: issue_title,
            issue_text: issue_text,
            created_by: created_by,
            created_on: new Date(),
            updated_on: new Date()
          })


        new_record.save()
          .then(function (models) {
            res.send({
              "assigned_to": models.assigned_to,
              "status_text": models.status_text,
              "open": true,
              "_id": models._id,
              "issue_title": models.issue_title,
              "issue_text": models.issue_text,
              "created_by": models.created_by,
              "created_on": models.created_on,
              "updated_on": models.updated_on
            })
          })
          .catch(function (err) {
            console.log(err)
          });



      }
    })



    .put(function (req, res) {
      let project = req.params.project;

      if (!req.body._id) {
        res.send({ error: 'missing _id' })
      }
      else if (!req.body.issue_text && !req.body.issue_title && !req.body.created_by && !req.body.assigned_to && !req.body.status_text) {
        res.send({ error: 'no update field(s) sent', '_id': req.body._id })
      }
      else {
        var idSearch = req.body._id

        if (req.body.issue_text == '') {
          req.body.issue_text = undefined
        }

        if (req.body.issue_title == '') {
          req.body.issue_title = undefined
        }

        if (req.body.assigned_to == '') {
          req.body.assigned_to = undefined
        }

        if (req.body.status_text == '') {
          req.body.status_text = undefined
        }

        if (req.body.created_by == '') {
          req.body.created_by = undefined
        }

        req.body.updated_on = new Date()

        Record.findByIdAndUpdate(idSearch, req.body)
          .then(function (models) {


            if (models == null) {
              res.send({ error: 'could not update', _id: req.body._id })
            } else {
              res.send({ result: 'successfully updated', _id: req.body._id })
            }

          })


          .catch(function (err) {
            console.log('error')
            res.send({ error: 'could not update', _id: req.body._id })
          });
      }


    })

    .delete(function (req, res) {
      let project = req.params.project;

      if (req.body._id == null) {
        res.send({ error: 'missing _id' })
      } else {

        //to reset database
        
        // record.deleteMany()  
        // .then(function (models)  {

        // })
        // .catch(function (err)  {

        // })


        var id = req.body._id
        Record.deleteMany({ _id: id }, { project_name: project })
          .then(function (models) {
            if (models.deletedCount == 0) {
              res.send({ error: 'could not delete', '_id': req.body._id })
            } else {
              res.send({ result: 'successfully deleted', '_id': req.body._id })
            }
          })
          .catch(function (err) {

            res.send({ error: 'could not delete', '_id': req.body._id })
          });
      }

    });

};
