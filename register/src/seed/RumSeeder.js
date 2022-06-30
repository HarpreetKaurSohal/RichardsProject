var ProductRum = require('../models/productRum');
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/registration');

var products = [
    new ProductRum({
        imagePath: '/css/plum.jpeg',
        title: 'Plum Rum Cake',
        price: 250
    }),
    new ProductRum({
        imagePath: '/css/cranberry.jpeg',
        title: 'Cranberry Rum Cake',
        price: 280
    }),
    new ProductRum({
        imagePath: '/css/cherry.jpg',
        title: 'Cherry Rum Cake',
        price: 290
    }),
    new ProductRum({
        imagePath: '/css/blueberry.jpg',
        title: 'Blueberry Rum Cake',
        price: 350
    }),
    new ProductRum({
        imagePath: '/css/strawberry.jpeg',
        title: 'Strawberry Rum Cake',
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