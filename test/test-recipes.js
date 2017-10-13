'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();
chai.use(chaiHttp);

before(function() {
  return runServer;
});

after(function() {
  return closeServer;
});

describe('Recipes', function() {
  it('should list recipes in GET', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        console.log(res.body);
        res.body.length.should.be.above(0);
        const expectedKeys = ['name', 'id', 'ingredients'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });
  it('should add a recipe on POST', function(){
    const newRecipe = {
      name: 'Steak Sandwich', ingredients: ['bread', 'steak']
    };
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(res){
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('name', 'id', 'ingredients');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
      });
  });

  it('should update items on PUT', function(){
    const updateRecipe = {
      name: 'Bahn Mi',
      ingredients: ['French Bread', 'cilantro', 'pork slice']
    };
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        updateRecipe.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updateRecipe.id}`)
          .send(updateRecipe);
      })
      .then(function(res){
        res.should.have.status(204);
        return chai.request(app)
          .get('/recipes')
          .then(function(res) {
            console.log(res);
        
          });
      
      });
    
  });

  it('should delete recipes on DELETE', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});




