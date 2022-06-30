var ProductPlain = require('../models/productPlain');
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/registration');

var products = [
    new ProductPlain({
        imagePath: '/css/plum.jpeg',
        title: 'Plum Plain Cake',
        price: 250
    }),
    new ProductPlain({
        imagePath: '/css/cranberry.jpeg',
        title: 'Cranberry Plain Cake',
        price: 280
    }),
    new ProductPlain({
        imagePath: '/css/cherry.jpg',
        title: 'Cherry Plain Cake',
        price: 290
    }),
    new ProductPlain({
        imagePath: '/css/blueberry.jpg',
        title: 'Blueberry Plain Cake',
        price: 350
    }),
    new ProductPlain({
        imagePath: '/css/strawberry.jpeg',
        title: 'Strawberry Plain Cake',
        price: 280
    })


];
var done=0;
for (var i=0;i<products.length;i++){
    products[i].save(function(err,result){
        done++;
        if(done === products.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}