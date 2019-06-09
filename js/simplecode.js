
// // Read JSON Datafile for starter inventory

// $.getJSON('./data/inventory.json',function(data){
// console.log(data);
// var output ='';
// var inventory_Array=[];
// $.each(data, function(key,val){
//     inventory_Array.push( [key, val.title, val.imagepath, val.price]);
//     output += '<div class="product" id="product"'+inventory_Array[key][0]+'>'+'<p class="title">'+val.title+'</p>'+'<div class="image_line">'+'<img src="'+val.imagepath+'">'+'</div>'+'<p class="price">$'+val.price+'</p>'+'</div>';
// });
// $('#inventory').html(output);
// console.log([inventory_Array[key][1]]);
// });



// Read JSON Datafile for starter inventory
var inventory_Array= [[],[]];
inventory_Array.pop(); inventory_Array.pop();

var order_Array= [[],[]];
inventory_Array.pop(); inventory_Array.pop();


$.getJSON('./data/inventory.json',function(data){
console.log(data);
var output ='';
$.each(data, function(key,val){
    inventory_Array.push( [key, val.title, val.imagepath, val.price]);
    output += '<div class="product" id="product-'+inventory_Array[key][0]+'" onClick="moveToCart(this.id)">'+'<p class="title">'+val.title+'</p>'+'<div class="image_line">'+'<img src="'+val.imagepath+'">'+'</div>'+'<p class="price">$'+val.price+'</p>'+'</div>';
}); 
$('#inventory').html(output);

});

function moveToCart(p1){
    var output ='';
    var splits= p1.split('-'); var mykey = parseInt(splits[1]); console.log(mykey);
    var key =  parseInt((inventory_Array[mykey][0]),10);
    output += '<div class="product">'+'<p class="title">'+inventory_Array[key][1]+'</p>'+'<div class="image_line">'+'<img src="'+inventory_Array[key][2]+'">'+'</div>'+'<p class="price">$'+inventory_Array[key][3]+'</p>'+'</div>';
    $('#orders').html(output); console.log(output);
};
