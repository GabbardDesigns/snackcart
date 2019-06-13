// Declare Global Variables
var paymentArray = [];
var paymentOptions_Array = [];
var inventory_Array= [];
var order_Array= [];
var output ='';
var ordersblock ='';
var inventorySection = '';
var price= parseFloat('0.00',10);

// formats currency 
function formatMoney(amount, decimalCount, decimal, thousands) {
    decimalCount = 2;
    decimal =".";
    thousands =",";
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

// // Clear initial arrays
// inventory_Array.pop(); inventory_Array.pop();
// order_Array.pop(); order_Array.pop();


// Read JSON Datafile for starter inventory
$.getJSON('./data/inventory.json',function(data){
$.each(data, function(key,val){
    inventory_Array.push( [key, val.title, val.imagepath, parseFloat(val.price,10)]);
    output += '<div class="product" id="product-'+inventory_Array[key][0]+'" onClick="moveToCart(this.id)">'+'<p class="title">'+val.title+'</p>'+'<div class="image_line">'+'<img src="'+val.imagepath+'">'+'</div>'+'<p class="price">$'+val.price+'</p>'+'</div>';
}); 
inventorySection= output;
$('#inventory').html(output);

});

// Recalculate and rewrite price 

function calculatePrice(priceAdd){
       price+= priceAdd;  
       $('#order_total').html('$ '+formatMoney(price)); 
    };

//use each to write to order arrays




// Moves items to cart, calls calculatePrice to update price 
function moveToCart(p1){
    var splits= p1.split('-'); 
    var mykey = parseInt(splits[1]);
    var key =  parseInt((inventory_Array[mykey][0]),10);
    var orderPrice = parseFloat(inventory_Array[key][3]);
    var orderImage = inventory_Array[key][2];
    var orderTitle = inventory_Array[key][1];
    order_Array.push([key, orderTitle, orderImage, orderPrice]);
    price = 0;
    redrawOrders();
};

// Redraws order section after add or removal
function redrawOrders() {
    ordersblock='';
    price = 0;
    for( var i = 0; i < order_Array.length; i++){ 
        var myprice= parseFloat(order_Array[i][3],10);
        var mytitle = order_Array[i][1];
        var myimage = order_Array[i][2];
        console.log('My Price is'+myprice);
        ordersblock += '<div class="product" onclick="removeFromCart(this.id)" id="order-'+(i)+'">'+'<p class="title">'+mytitle+'</p>'+'<div class="image_line">'+'<img src="'+myimage+'">'+'</div>'+'<p class="price">$'+formatMoney(myprice)+'</p>'+'</div>';    
        calculatePrice(parseFloat(myprice));
     }
    $('#orders').html(ordersblock);
    $('#order_total').html('$ '+formatMoney(price)); 
    };




// Clears entire order, clears and redraws Orders Section and resets price
function clearOrder(){
    order_Array=[];
    console.log(order_Array)
    ordersblock =''; 
    price= parseFloat('0.00');
    $('#orders').html(ordersblock); 
    $('#order_total').html('$ '+formatMoney(price)); 
};


function removeFromCart(p1){
    var splits= p1.split('-'); 
    var mykey = (parseInt(splits[1])); 
    var price_reduction= (-1 * parseFloat(order_Array[mykey][3]));
    order_Array.splice([mykey],1); 
   redrawOrders();

};

function paymentView(){
    var orderSwitch= '';
    var inventorySwitch= '';
    inventorySwitch+= '<div id="inventory_title" class="section_title">Payment Options</div> <div id="payOptions" class="inventory_list_section">';
    // Read JSON Datafile for pay info
    $.getJSON('./data/pay.json',function(data){
        $.each(data, function(key,val){
            paymentOptions_Array.push( [key, val.title, val.imagepath, val.price, val.type, val.value]);
            inventorySwitch += '<div class="'+val.type+'" id="pay-'+key+'" onclick="pay(this.id)"><div class="image_line"><img src="'+val.imagepath+'"></div><p class="title">'+val.title+'<br>$'+formatMoney(val.price)+'</p></div>'; 
        }); 
        inventorySwitch += '</div>';
        $('#first_container').html(inventorySwitch);
    
        var buttonswitch = '<button class="pay" onclick="productView()">Edit Order</button>'
        $('#paybutton').html(buttonswitch);
        

    orderSwitch+= '<div id="order_title" class="section_title">Amount Paid</div> <div id="paidIn" class="order_list_section"></div></div>';
    $('#second_container').html(orderSwitch);
    })
    };

   
        function pay (p1){
            var splits= p1.split('-'); 
            var mykey = parseInt(splits[1]);
            var key =  parseInt((paymentOptions_Array[mykey][0]),10);
            var payValue = parseFloat(paymentOptions_Array[key][3]);
            var payImage = paymentOptions_Array[key][2];
            var payTitle = paymentOptions_Array[key][1];
            paymentArray.push([key, payTitle, payImage, payValue]);
            redrawPayment();
        };
    

        function redrawPayment() {
            paidIn='';
            var paidAmount=0;
                        for( var i = 0; i < paymentArray.length; i++){ 
                
                var payValue= parseFloat(paymentArray[i][3],10);
                var payTitle = paymentArray[i][1];
                var payImage = paymentArray[i][2];
                console.log('My value is '+payValue);
                paidIn += '<div class="product" onclick="removePayment(this.id)" id="order-'+(i)+'">'+'<p class="title">'+payTitle+'</p>'+'<div class="image_line">'+'<img src="'+payImage+'">'+'</div>'+'<p class="price">$'+formatMoney(payValue)+'</p>'+'</div>';    
                paidAmount += parseFloat(payValue);
             }
             calculatePrice(-1*(parseFloat(payValue)));
            $('#paidIn').html(paidIn);
            $('#order_total').html('$ '+formatMoney(price)); 
            };


            
        function removePayment(p1){
                var splits= p1.split('-'); 
                var mykey = (parseInt(splits[1])); 
                var price_increase= parseFloat(paymentArray[mykey][3]);
                paymentArray.splice([mykey],1); 
                redrawPayment();
            
            };

function productView(){
    var orderReturn= '';
    var inventoryReturn= '';
    inventoryReturn+= '<div id="inventory_title" class="section_title">Our Products</div> <div id="payOptions" class="inventory_list_section">'+inventorySection+'</div>';
    orderReturn+= '<div id="order_title" class="section_title">Amount Paid</div> <div id="paidIn" class="order_list_section">'+ordersblock+'</div></div>';
    $('#first_container').html(inventoryReturn);
    $('#second_container').html(orderReturn);
}


            