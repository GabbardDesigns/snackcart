
// Read JSON Datafile for starter inventory

$.getJSON('./data/inventory.json',function(data){
console.log(data);
var output ='';
var inventory_Array=[];
$.each(data, function(key,val){
    inventory_Array.push( [key, val.title, val.imagepath, val.price]);
    output += '<div class="product" id="product"'+inventory_Array[key][0]+'>'+'<p class="title">'+val.title+'</p>'+'<div class="image_line">'+'<img src="'+val.imagepath+'">'+'</div>'+'<p class="price">$'+val.price+'</p>'+'</div>';
});
$('#inventory').html(output);
console.log([inventory_Array[key][1]]);
});

