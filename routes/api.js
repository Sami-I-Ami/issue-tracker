'use strict';

module.exports = function (app) {

  let currentId = 0;
  let issues = [];

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      const index = issues.findIndex((projectIssues) => projectIssues.project_name == project);
      let issueList = issues[index].issues;
      const queries = req.query;
      for (const key in queries) {
        issueList = issueList.filter((issue) => issue[key] == queries[key]);
      }
      res.send(issueList);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title | !issue_text | !created_by) {
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
          _id: currentId.toString(),
          issue_title: issue_title,
          issue_text: issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by,
          assigned_to: assigned_to,
          open: true,
          status_text: status_text
        };
        const index = issues.findIndex((projectIssues) => projectIssues.project_name == project);
        if (index === -1) {
          issues.push({project_name: project, issues: [issueObj]});
        } else {
          issues[index].issues.push(issueObj);
        }
        res.json(issueObj);
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      res.json({return: "blank"});
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      res.json({return: "blank"});
    });
    
};
