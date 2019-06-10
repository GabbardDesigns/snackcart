// Declare Global Variables

var inventory_Array= [];
var order_Array= [];
var output ='';
var ordersblock ='';
var price= parseFloat('0.00',10);

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
    inventory_Array.push( [key, val.title, val.imagepath, val.price]);
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
    order_Array.push([key, inventory_Array[key][1], inventory_Array[key][2], inventory_Array[key][3]]);
    console.log(inventory_Array[key]);
    redrawOrders();
    calculatePrice(parseFloat((inventory_Array[key][3])));
};

// Redraws order section after add or removal
function redrawOrders() {
    ordersblock='';
    for( var i = 0; i <= order_Array.length; i++){ 
        ordersblock += '<div class="product" onclick="removeFromCart(this.id)" id="order-'+(i)+'">'+'<p class="title">'+(order_Array[i][1])+'</p>'+'<div class="image_line">'+'<img src="'+order_Array[i][2]+'">'+'</div>'+'<p class="price">$'+order_Array[i][3]+'</p>'+'</div>';    
     }
    $('#orders').html(ordersblock);
    };

// Clears entire order, clears and redraws Orders Section and resets price
function clearOrder(){
    ordersblock =''; 
    price= parseFloat('0.00');
    $('#orders').html(ordersblock); 
    $('#order_total').html('$ '+formatMoney(price)); 
};


function removeFromCart(p1){
    var splits= p1.split('-'); 
    var mykey = (parseInt(splits[1])-1); 
    var price_reduction;
    for( var i = 0; i < order_Array.length; i++){ 
        if ( order_Array[i] === mykey) { 
            price_reduction = orderArray([i][3]);
            order_Array.splice([i]); 
        }
     }
   document.getElementById(p1).remove();
   calculatePrice(parseFloat(price_reduction));
};


