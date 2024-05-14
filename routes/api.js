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
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      if (!_id) {
        res.json({error: "missing _id"})
      } else if (!issue_title & !issue_text & !created_by & !assigned_to & !status_text & !open) {
        res.json({error: "no update field(s) sent", _id})
      } else {
        const index = issues.findIndex((projectIssues) => projectIssues.project_name == project);
        const issueIndex = issues[index].issues.findIndex((issue) => issue._id == _id);
        let issueToUpdate = issues[index].issues[issueIndex];
        issues[index].issues.splice(issueIndex, 1);
        const updatedValues = [issue_title, issue_text, created_by, assigned_to, status_text, open];
        const valueLabels = ["issue_title", "issue_text", "created_by", "assigned_to", "status_text", "open"];
        try{
          for (let i = 0; i < updatedValues.length; i++) {
            if (updatedValues[i]) {
              issueToUpdate[valueLabels[i]] = updatedValues[i];
            }
          }
          issueToUpdate.updated_on = new Date(); 
          issues[index].issues.push(issueToUpdate);
          res.json({result: "successfully updated", _id}) 
        } catch (err) {
          res.json({error: "could not update", _id});
        }
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      const _id = req.body._id;
      if (!_id) {
        res.json({error: "missing _id"})
      } else {
        const index = issues.findIndex((projectIssues) => projectIssues.project_name == project);
        const issueIndex = issues[index].issues.findIndex((issue) => issue._id == _id);
        if (issueIndex == -1) {
          res.json({error: "could not delete", _id});
        } else {
          issues[index].issues.splice(issueIndex, 1);
          res.json({result: "successfully deleted", _id});
        }
      }
    });
    
};
