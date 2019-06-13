// Declare Global Variables

var inventory_Array= [[],[]];
var order_Array= [[],[]];
var output ='';
var ordersblock ='';
var price= parseFloat('0.00',10);
var order_place = 0;

// formats currency 
function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  };

// Clear initial arrays
inventory_Array.pop(); inventory_Array.pop();
order_Array.pop(); order_Array.pop();


// Read JSON Datafile for starter inventory
$.getJSON('./data/inventory.json',function(data){
console.log(data);
$.each(data, function(key,val){
    inventory_Array.push( {key:key, title:val.title, imagepath:val.imagepath, price:val.price});
    console.log(inventory_Array);
    output += '<div class="product" id="product-'+inventory_Array[key][0]+'" onClick="moveToCart(this.id)">'+'<p class="title">'+val.title+'</p>'+'<div class="image_line">'+'<img src="'+val.imagepath+'">'+'</div>'+'<p class="price">$'+val.price+'</p>'+'</div>';
}); 
$('#inventory').html(output);

});

// Recalculate and rewrite price 

function calculatePrice(priceAdd){
       price+= priceAdd;  
       $('#order_total').html('$ '+formatMoney(price)); 
    };


// Moves items to cart, calls calculatePrice to update price 
function moveToCart(p1){
    var splits= p1.split('-'); var mykey = parseInt(splits[1]); console.log(mykey);
    var key =  parseInt((inventory_Array[mykey][0]),10);
    order_Array.push[key, inventory_Array[key][1], inventory_Array[key][2], inventory_Array[key][3]];
    console.log(inventory_Array[key]);
   
    ordersblock += '<div class="product" id="order_item'+ order_place+'">'+'<p class="title">'+inventory_Array[key][1]+'</p>'+'<div class="image_line">'+'<img src="'+inventory_Array[key][2]+'">'+'</div>'+'<p class="price">$'+inventory_Array[key][3]+'</p>'+'</div>';
    $('#orders').html(ordersblock); console.log(ordersblock);
    order_place++;
    calculatePrice(parseFloat((inventory_Array[key][3])));
};

// Clears entire order, clears and redraws Orders Section and resets price
function clearOrder(){
    ordersblock =''; 
    price= parseFloat('0.00');
    $('#orders').html(ordersblock); 
    $('#order_total').html('$ '+formatMoney(price)); 
};



// Removes items from cart, calls calculatePrice to update price 
function removeFromCart(p1){
    var splits= p1.split('-'); 
    var mykey = parseInt(splits[1]); 
    console.log(mykey);
    var key =  parseInt((inventory_Array[mykey][0]),10);
    order_Array.push[key, inventory_Array[key][1], inventory_Array[key][2], inventory_Array[key][3]];
    console.log(inventory_Array[key]);
    ordersblock += '<div class="product">'+'<p class="title">'+inventory_Array[key][1]+'</p>'+'<div class="image_line">'+'<img src="'+inventory_Array[key][2]+'">'+'</div>'+'<p class="price">$'+inventory_Array[key][3]+'</p>'+'</div>';
    $('#orders').html(ordersblock); console.log(ordersblock);

    calculatePrice(parseFloat((inventory_Array[key][3])));
};