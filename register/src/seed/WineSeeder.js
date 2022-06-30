var ProductWine = require('../models/productWine');
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/registration');

var products = [
    new ProductWine({
        imagePath: '/css/plum.jpeg',
        title: 'Plum Wine Cake',
        price: 250
    }),
    new ProductWine({
        imagePath: '/css/cranberry.jpeg',
        title: 'Cranberry Wine Cake',
        price: 280
    }),
    new ProductWine({
        imagePath: '/css/cherry.jpg',
        title: 'Cherry Wine Cake',
        price: 290
    }),
    new ProductWine({
        imagePath: '/css/blueberry.jpg',
        title: 'Blueberry Wine Cake',
        price: 350
    }),
    new ProductWine({
        imagePath: '/css/strawberry.jpeg',
        title: 'Strawberry Wine Cake',
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
