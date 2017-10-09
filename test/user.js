process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index.js');
let should = chai.should();

const Models = require('../db.js')
const User = Models.User

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     User.destroy({
    //       where: {},
    //       truncate: true
    //     })
    // });
/*
  * Test the /GET route
  */
  describe('/GET user', () => {
      it('it should GET all users', (done) => {
        chai.request(server)
            .get('/api/v1/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.users.should.be.a('array');
                res.body.users.length.should.be.eql(0);
              done();
            });
      });
  });

  describe('/POST user', () => {
      it('it should Create a USER', (done) => {
        chai.request(server)
            .post('/api/v1/users')
            .send({
              "username": "testuser",
              "email": "user@test.co",
              "password": "password123"
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
              done();
            });
      });
  });

});