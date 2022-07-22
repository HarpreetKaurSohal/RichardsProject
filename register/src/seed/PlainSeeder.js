var ProductPlain = require('../models/productPlain');
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/registration');

var products = [
    new ProductPlain({
        imagePath: '/css/plum.jpeg',
        title: 'Walnut Cake',
        price: 150
    }),
    new ProductPlain({
        imagePath: '/css/cranberry.jpeg',
        title: 'Choco Walnut Cake',
        price: 200
    }),
    new ProductPlain({
        imagePath: '/css/cherry.jpg',
        title: 'Cherry Plain Cake',
        price: 290
    }),
    new ProductPlain({
        imagePath: '/css/blueberry.jpg',
        title: 'Rose Cake',
        price: 150
    }),
    new ProductPlain({
        imagePath: '/css/strawberry.jpeg',
        title: 'Vanilla Sponge Cake',
        price: 150
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