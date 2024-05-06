'use strict';

module.exports = function (app) {

  let currentId = 0;
  let issues = [];

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title.trim() | !issue_text.trim() | !created_by.trim()) {
        res.json({error: 'required field(s) missing'});
      } else {
        
      }
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
