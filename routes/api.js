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
        currentId++;
        if (!assigned_to) {
          assigned_to = "";
        }
        if (!status_text) {
          status_text = "";
        }
        const issueObj = {
          _id: currentId,
          issue_title: issue_title,
          issue_text: issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by,
          assigned_to: assigned_to,
          open: true,
          status_text: status_text
        };
        const currentProject = issues.filter((projectIssues) => 
          projectIssues.project_name == project
        );
        if (!currentProject) {
          issues.push({project_name: project, issues: [issueObj]});
        } else {
          index = issues.indexOf(currentProject);
          issues[index].issues.push(issueObj);
        }
        console.log(issues);
        res.json(issueObj);
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
