
// Read JSON Datafile for starter inventory

$.getJSON('./data/inventory.json',function(data){
console.log(data);
var output ='';
var inventory_Array=[];
$.each(data, function(key,val){
    inventory_Array[key][0]= key;
    inventory_Array[key][1]= val.title;
    inventory_Array[key][2]= val.imagepath;
    inventory_Array[key][3]= val.price;
    output += '<div class="product">'+'<p class="title">'+val.title+'</p>'+'<div class="image_line">'+'<img src="'+val.imagepath+'">'+'</div>'+'<p class="price">$'+val.price+'</p>'+'</div>';
});
$('#inventory').html(output);
});

console.log[inventory_Array[1][1]];