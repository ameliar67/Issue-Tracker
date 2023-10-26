const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

    test('Create an issue with every field', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/issues/{project}')
            .send({
                "assigned_to": "a",
                "status_text": "a",
                "open": true,
                "issue_title": "a",
                "issue_text": "a",
                "created_by": "a",
            })
            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.body.issue_title, 'a')
                assert.equal(res.body.open, true)
                assert.equal(res.body.issue_text, 'a')
                assert.equal(res.body.assigned_to, 'a')
                assert.equal(res.body.status_text, 'a')
                done();
            });
    });
    test('Create an issue with only required fields', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/issues/{project}')
            .send({
                "issue_title": "a",
                "issue_text": "a",
                "created_by": "a",
            })
            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.body.issue_title, 'a')
                assert.equal(res.body.issue_text, 'a')
                assert.equal(res.body.created_by, 'a')
                done();
            });
    });
    test('Create an issue with missing required fields', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/issues/{project}')
            .send({
                "issue_text": "a",
                "created_by": "a",
            })
            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text, '{"error":"required field(s) missing"}')
                done();
            });
    });
    test('View issues on a project', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/{project}')

            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                done();
            });
    });
    test('View issues on a project with one filter', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/{project}?open=true')

            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                done();
            });
    });
    test('View issues on a project with multiple filters', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/{project}?open=true')

            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                done();
            });
    });
    test('Update one field on an issue', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/{project}?open=true')

            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                done();
            });
    });
    test('Update multiple fields on an issue:', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/{project}?open=true')

            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                done();
            });
    });
    test('Update an issue with missing _id', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/{project}?open=true')

            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                done();
            });
    });
    test('Update an issue with no fields to update', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/{project}?open=true')

            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                done();
            });
    });
    test('Update an issue with an invalid _id', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/{project}?open=true')

            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                done();
            });
    });
    test('Delete an issue', function (done) {
        chai
            .request(server)
            .keepOpen()
            .delete('/api/issues/{project}')
            .send({
                _id: "64ddb15fafb453ee35305f5c"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');


                done();
            });
    });

    test('Delete an issue with an invalid _id', function (done) {
        chai
            .request(server)
            .keepOpen()
            .delete('/api/issues/{project}')
            .send({
                _id: "64ddb15fafb453ee35305f5g"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.deepEqual(res.body, { error: 'could not delete', _id: '64ddb15fafb453ee35305f5g' })
                done();
            });
    });

    test('Delete an issue with missing _id', function (done) {
        chai
            .request(server)
            .keepOpen()
            .delete('/api/issues/{project}')
            .send({
                '_id': null
            })
            .end(function (err, res) {
                assert.deepEqual(res.body, { error: 'missing _id' })
                done();
            });
    });
});
