
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
order_Array.pop(); order_Array.pop();


$.getJSON('./data/inventory.json',function(data){
console.log(data);
var output ='';
$.each(data, function(key,val){
    inventory_Array.push( [key, val.title, val.imagepath, val.price]);
    output += '<div class="product" id="product-'+inventory_Array[key][0]+'" onClick="moveToCart(this.id)">'+'<p class="title">'+val.title+'</p>'+'<div class="image_line">'+'<img src="'+val.imagepath+'">'+'</div>'+'<p class="price">$'+val.price+'</p>'+'</div>';
}); 
$('#inventory').html(output);

});

var ordersblock ='';
var price=0.00;
function calculatePrice(){
    for (var items=0, items <= order_Array.length; items++){
        price+= parseFloat((order_Array[items][3]),10);
    };
}

function moveToCart(p1){
    var splits= p1.split('-'); var mykey = parseInt(splits[1]); console.log(mykey);
    var key =  parseInt((inventory_Array[mykey][0]),10);
    order_Array.push[key, inventory_Array[key][1], inventory_Array[key][2], inventory_Array[key][3]];
    console.log(inventory_Array[key]);
    ordersblock += '<div class="product">'+'<p class="title">'+inventory_Array[key][1]+'</p>'+'<div class="image_line">'+'<img src="'+inventory_Array[key][2]+'">'+'</div>'+'<p class="price">$'+inventory_Array[key][3]+'</p>'+'</div>';
    $('#orders').html(ordersblock); console.log(ordersblock);

    calculatePrice();
};

function clearOrder(){
    ordersblock ='';
    $('#orders').html(ordersblock); console.log(ordersblock);
};

