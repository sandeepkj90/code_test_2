const request = require('supertest');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const app = require('../app');
const sinon = require("sinon");
const expect = chai.expect;
const Pet = require('../models/pets');
chai.use(chaiAsPromised);

describe('functional - pet', ( ) => {
  it('should fail to create a pet without a name', async () => {
    const res = await request(app).post('/pets').send({
        age: 4,
        color: 'red'
    });
    
    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('"name" is required');
   
   
  });

  it('should create a pet', async ( ) => {
    Pet.prototype.save = function(){
      return Promise.resolve({
        name: 'dog',
        age: 4,
        color: 'red'
      });
    }
    const pet = {
        name: 'dog',
        age: 4,
        color: 'red'
    };
    const res = await request(app).post('/pets').send(pet);
    expect(res.status).to.equal(201);
    expect(res.body.name).to.equal(pet.name);
    expect(res.body.age).to.equal(pet.age);
    expect(res.body.color).to.equal(pet.color);
   
  
  });

  it('should get a pet', async ( ) => {
    const stub = sinon.stub(Pet, "find").returns([{
      name: 'dog',
      age: 4,
      color: 'red'
    }]);
    
   
    const res = await request(app).get('/pets').send();
    expect(stub.calledOnce).to.be.true;
    expect(res.status).to.equal(200);   
    
  });

  it('should delete a pet', async ( ) => {
    Pet.remove = function(){
      return Promise.resolve();
    }
   
    let res = await request(app).del('/pets/dog').send();
    expect(res.status).to.equal(200);   
  
  });
});

