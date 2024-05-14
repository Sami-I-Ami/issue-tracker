const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);
    test('POST with every input', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/test')
          .send({
            issue_title: "Test",
            issue_text: "This is a test",
            created_by: "Me",
            assigned_to: "You",
            status_text: "Submitted"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.issue_title, "Test");
            assert.equal(res.body.issue_text, "This is a test");
            assert.equal(res.body.created_by, "Me");
            assert.equal(res.body.assigned_to, "You");
            assert.equal(res.body.open, true);
            assert.equal(res.body.status_text, "Submitted");
            assert.exists(res.body._id);
            assert.exists(res.body.created_on);
            assert.exists(res.body.updated_on);
            done();
          });
    });
    test('POST with only required', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/test')
          .send({
            issue_title: "Another test",
            issue_text: "This only has required",
            created_by: "Someone"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.issue_title, "Another test");
            assert.equal(res.body.issue_text, "This only has required");
            assert.equal(res.body.created_by, "Someone");
            assert.equal(res.body.assigned_to, "");
            assert.equal(res.body.open, true);
            assert.equal(res.body.status_text, "");
            assert.exists(res.body._id);
            assert.exists(res.body.created_on);
            assert.exists(res.body.updated_on);
            done();
          });
    });
    test('POST without required', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/test')
          .send({
            issue_text: "This is a test",
            created_by: "Me"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, "required field(s) missing");
            done();
          });
    });
    test('GET full issue list', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/test')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isArray(res.body);
            assert.equal(res.body.length, 2);
            done();
          });
    });
    test('GET issue list with one filter', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/test?open=true')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isArray(res.body);
            console.log(res.body);
            done();
          });
    });
});
