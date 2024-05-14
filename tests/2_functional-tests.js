const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);
    // POST
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

    // GET
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
            assert.equal(res.body.length, 2);
            done();
          });
    });
    test('GET issue list with multiple filters', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/test?open=true&created_by=Me')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isArray(res.body);
          assert.equal(res.body.length, 1);
          done();
        });
  });

  // PUT
  test('PUT one field', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test')
      .send({
        _id: "1",
        assigned_to: "A worker"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "1");
        done();
      });
  });
  test('PUT multiple fields', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test')
      .send({
        _id: "1",
        assigned_to: "A new worker",
        status_text: "We're working on it"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "1");
        done();
      });
  });
  test('PUT without _id', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test')
      .send({
        assigned_to: "Who"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
  test('PUT without fields', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test')
      .send({
        _id: "1"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, "no update field(s) sent");
        assert.equal(res.body._id, "1");
        done();
      });
  });
  test('PUT invalid _id', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/test')
      .send({
        _id: "3",
        assigned_to: "Doesn't exist"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, "could not update");
        assert.equal(res.body._id, "3");
        done();
      });
  });

  // DELETE
  test('DELETE valid _id', function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/test')
      .send({
        _id: "2"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, "2");
        done();
      });
  });
  test('DELETE invalid _id', function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/test')
      .send({
        _id: "5"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, "5");
        done();
      });
  });
  test('DELETE missing _id', function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/test')
      .send({
        not_id: "hi"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
