// Declare Global Variables
var inventorySection = "";
var inventoryView = "";
var paymentArray = [];
var paymentOptions_Array = [];
var inventory_Array = [];
var order_Array = [];
var output = "";
var ordersBlock = "";
var price = parseFloat("0.00", 10);
var productsPrice = 0;
var paymentTotal = 0;
var refundOptions_Array = [];
var refundArray = [];
var refundAmount;
var refundTotal = 0;
var refundDue;
var modal = document.getElementById("modal");
var overlay = document.getElementById("overlay");
var modalPermissions = true;
var paymentTotal=0;

// // Read JSON Datafile for refundOptions
function getRefundOptions(){
var request = new XMLHttpRequest();
request.open('GET', './data/refund.json', true);
request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    var data = JSON.parse(request.responseText);
    //  console.log(data);
    data.forEach(function(val, key){
      refundOptions_Array.push([
        key,
        val.title,
        val.imagepath,
        val.price,
        val.type,
        val.value,
        val.alt
      ]);
    });
  } 
};
request.send();
}

getRefundOptions();

// Read JSON Datafile for paymentOptions
function getPaymentOptions() {
  var request = new XMLHttpRequest();  
request.open('GET', './data/pay.json', true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      //  console.log(data);
      data.forEach(function(val, key){
    paymentOptions_Array.push([
      key,
      val.title,
      val.imagepath,
      val.price,
      val.type,
      val.value,
      val.alt
    ]);
  });
} 
};
request.send();
};

getPaymentOptions();

// Read JSON Datafile for starter inventory and define inventory section in the HTML
function importInventory(){
    var request = new XMLHttpRequest();  
    request.open('GET', './data/inventory.json', true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);
          //  console.log(data);
          data.forEach(function(val, key){
    inventory_Array.push([
      key,
      val.title,
      val.imagepath,
      parseFloat(val.price, 10),
      val.alt
    ]);
    output +=
      '<div class="product" id="product-' +
      inventory_Array[key][0] +
      '" onClick="moveToCart(this.id)">' +
      '<p class="title noselect">' +
      val.title +
      "</p>" +
      '<div class="image_line noselect">' +
      '<img src="' +
      val.imagepath +
      '" alt="'+ val.alt +'">' +
      "</div>" +
      '<p class="price noselect">$' +
      val.price +
      "</p>" +
      "</div>";
  });
  inventorySection = output;
  document.getElementById("inventory").innerHTML=output;
}};
request.send();
}

importInventory();

// Function: formatMoney - beautiful borrowed script that parses the provided amount and applies a .fixed(decimal) to the it amoung other things (logic for thousands place operator)
// May come back and trim the thousands place items out since this application does not need to worry about them.
function formatMoney(amount, decimalCount, decimal, thousands) {
  decimalCount = 2;
  decimal = ".";
  thousands = ",";
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    //  console.log(e);
  }
}

// Function scrollToBottom - Forces scroll to the bottom of container
// Used when payment, refund, or cart containers overflow on add.
function scrollToBottom(id){
  let scroll = document.getElementById(id);
  scroll.scrollTop = scroll.scrollHeight;
}

// Function calculatePrice - Recalculates and rewrites price
function calculatePrice(priceAdd) {
  price += priceAdd;
  document.getElementById("order_total").innerHTML=("$ " + formatMoney(price));
}

// Function moveToCart - Moves items to cart
  // Parses the id passed to the function and uses that value to get the array key for the item clicked
  // Reads the information from the inventoryArray for that item
  // Pushes this information to the end of the orderArray.
  // Redraws the orders section using redrawOrders() (This function updates cart contents and price)

function moveToCart(p1) {
  var splits = p1.split("-");
  var mykey = parseInt(splits[1]);
  var key = parseInt(inventory_Array[mykey][0], 10);
  var orderPrice = parseFloat(inventory_Array[key][3]);
  var orderImage = inventory_Array[key][2];
  var orderTitle = inventory_Array[key][1];
  var orderAlt = inventory_Array[key][4];
  order_Array.push([key, orderTitle, orderImage, orderPrice, orderAlt]);
  price = 0;
  redrawOrders();
}

// Function redrawOrders- Redraws order section after add or removal
// Wipes HTML container, loops through the orders array and rebuilds the HTML for the section.
function redrawOrders() {
  ordersBlock = "";
  price = 0;
  for (var i = 0; i < order_Array.length; i++) {
    var myprice = parseFloat(order_Array[i][3], 10);
    var mytitle = order_Array[i][1];
    var myimage = order_Array[i][2];

    ordersBlock +=
      '<div class="product" onclick="removeFromCart(this.id)" id="order-' +
      i +
      '">' +
      '<p class="title noselect" aria-live="polite">' +
      mytitle +
      "</p>" +
      '<div class="image_line noselect">' +
      '<img src="' +
      myimage
      + '" alt="'+ order_Array[i][4] +'">' +
      "</div>" +
      '<p class="price noselect">$' +
      formatMoney(myprice) +
      "</p>" +
      "</div>";
    calculatePrice(parseFloat(myprice));
  }
  buttonswitch = '<button class="button disable" onclick="areYouSure()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button cta" onclick="paymentView()">Pay Now</button>';    
  document.getElementById("paybutton").innerHTML=buttonswitch;
  document.getElementById("orders").innerHTML=ordersBlock;
  document.getElementById("payHolder").innerHTML= `<div aria-live="polite" class="total_label" id="order_total_label">Amount Due:</div> <div aria-live="polite" class="total_amount"  id="order_total">`+("$ " + formatMoney(price))+`</div>`;
  // document.getElementById("order_total_label").innerHTML="Amount Due:";
  // document.getElementById("order_total").innerHTML=("$ " + formatMoney(price));

  scrollToBottom('orders');
}

// Function clearOrder - Clears entire order
  // Clears order array, payment Array, and refund Array.  | Redraws Orders Section and resets price
function clearOrder() {
  clearModal();
  order_Array = [];

  ordersBlock = "";
  productView();
  price = parseFloat("0.00");
  paymentTotal=0;

  paymentArray = [];
  refundArray = [];

  buttonswitch = '<button class="button disable" onclick="paymentView()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button disable" onclick="paymentView()">Pay Now</button>';    
  document.getElementById("paybutton").innerHTML=buttonswitch;
  document.getElementById("orders").innerHTML=ordersBlock;
  document.getElementById("order_total").innerHTML=("$ " + formatMoney(price));
}

// Function paymentView - Redraws the screen when going from Inventory view to Payment view
  // Saves the value of cart inventory in global productsPrice.
function paymentView() {
  productsPrice = price;
  var orderSwitch = "";
  var inventorySwitch = "";
  inventorySwitch +=
    '<div id="inventory_title" aria-live="polite" class="section_title">Payment Options</div> <div id="payOptions" aria-live="polite" class="inventory_list_section">';
   // Reads the payment_Array and redraws the payment options
  for (let i = 0; i < paymentOptions_Array.length; i++) {
    inventorySwitch +=
      '<div class="' +
      paymentOptions_Array[i][4] +
      '" id="pay-' +
      paymentOptions_Array[i][0] +
      '" onclick="pay(this.id)"><div class="image_line noselect"><img src="' +
      paymentOptions_Array[i][2]
      + '" alt="'+ paymentOptions_Array[i][6] +'">' +
      '</div><p class="title noselect">' +
      paymentOptions_Array[i][1];
      inventorySwitch += "   $";    
      inventorySwitch += formatMoney(paymentOptions_Array[i][5]) +
      "</p></div>";
    }
 
    inventorySwitch += "</div>";
 
    var buttonswitch =
      '<button class="button pale" onclick="areYouSure()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button" onclick="productView()">Edit Order</button>';
    orderSwitch +=
      '<div id="order_title" class="section_title">Amount Paid</div> <div id="paidIn" class="order_list_section"></div></div>';
  
  // Redraws the entire screen 
  document.getElementById("second_container").innerHTML=orderSwitch;
  document.getElementById("order_total_label").innerHTML="Amount Due: ";
  document.getElementById("first_container").innerHTML=inventorySwitch;
  document.getElementById("paybutton").innerHTML=buttonswitch;
  document.getElementById("order_total").innerHTML=("$ " + formatMoney(price));
  
}

// Function Pay - Calculates Payments
  // Parses the id passed to the function and uses that value to get the array key for the item clicked
  // Reads the information from the paymentOptions array for that item
  // Pushes this information to the end of the payment array.
  // Redraws the payments section

function pay(id) {
  var splits = id.split("-");
  var mykey = parseInt(splits[1]);
  var key = parseInt(paymentOptions_Array[mykey][0], 10);
  var payValue = parseFloat(paymentOptions_Array[key][3]);
  var payImage = paymentOptions_Array[key][2];
  var payTitle = paymentOptions_Array[key][1];
  var paymentClass = paymentOptions_Array[key][4];
  var paymentAlt =  paymentOptions_Array[key][6];
  paymentArray.push([key, payTitle, payImage, payValue, paymentClass, paymentAlt]);
  redrawPayment();
  orderStatus();
}

// Function Order Status -  Checks for state of cart
  // If amount is greater than 0 prompt to pay or clear order 
  // If less than 0, prompt to issue refund (activate Issue Refund button and pale New Order button) 
  // Otherwise payment total equals zero, so activate New Order button and show modal for Order Completed. 
function orderStatus() {
  var buttonswitch;
  if (paymentTotal > 0) {
    buttonswitch = '<button class="button pale" onclick="areYouSure()">New Order</button> <button aria-live="polite" class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button" onclick="productView()">Edit Order</button>'; 
  } else if (paymentTotal < 0) {
    for (let i = 0; i < paymentOptions_Array.length; i++) {
      let payId = 'pay-'+[i];
      document.getElementById(payId).classList.add("disable");
    }
    buttonswitch ='<button class="button pale" onclick="areYouSure()">New Order</button> <button aria-live="polite" class="button refund" onclick="refundView()">Issue Refund</button> <button class="button" onclick="productView()">Edit Order</button>';    
  } else {
      document.getElementById("payOptions").classList.add("disable");
      document.getElementById("paidIn").classList.add("disable");
      buttonswitch = '<button class="button new" onclick="clearOrder()">New Order</button> <button aria-live="polite" class="button disable" onclick="refundView()">Issue Refund</button> <button class="button disable" onclick="paymentView()">Pay Now</button>'; 
    
    if(modalPermissions){
      document.getElementById("order_Completed").style.display='block';
      showModal();
     };
  }

 document.getElementById("paybutton").innerHTML=buttonswitch;
}

//Function paymentEnable
  // Checks that previously disabled payment amounts are should still be disabled, enables if needed. 
function paymentEnable(){
  for (let i = 0; i < paymentOptions_Array.length; i++) {
    let payId = 'pay-'+[i];
    document.getElementById(payId).classList.remove("disable");
  }
}

// Function removePayment 
  // Receives the Payment's ID as an argument | Parses the payment ID to get the array key
  // Removes the specific payment from the paymentArray | Redraws Payment section using the updated array

function removePayment(id) {
  // Pulls the array key from the payment's ID.
  var splits = id.split("-");
  var mykey = parseInt(splits[1]);
  paymentArray.splice([mykey], 1);

  // Redraws the payment section using the updated array
  redrawPayment();
  paymentEnable();
  orderStatus();
}

// Function productView - Invoked when returning to product view from Payment or refund view
  // Redraws the Inventory and the cart  | Wipes payment and refund arrays
function productView() {
  var orderReturn = "";
  var inventoryReturn = "";
  var buttonswitch =
  '<button class="button pale" onclick="areYouSure()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button" onclick="paymentView()">Pay Now</button>';
  inventoryReturn +=
    '<div id="inventory_title" class="section_title">Our Products</div> <div id="payOptions" class="inventory_list_section">' +
    inventorySection +
    "</div>";
  orderReturn +=
    '<div id="order_title" class="section_title">This Order</div><div class="order_list_section" id="orders">' +
    ordersBlock +
    "</div></div>";

    // Clears the payment and refund arrays (if you go back to the Edit the order, all payment and refund progress is wiped)
    paymentArray = [];
    refundArray = [];

    // Redraws the entire screen 
    document.getElementById("first_container").innerHTML=inventoryReturn;
    document.getElementById("second_container").innerHTML=orderReturn;
    document.getElementById("paybutton").innerHTML=buttonswitch;
    document.getElementById("order_total").innerHTML=("$ " + formatMoney(price));
    document.getElementById("order_total_label").innerHTML="Amount Due: ";
}

// Function calculatePayment - receives amount paid, subtracts this from the total amount due.  
function calculatePayment(amount) {
  paymentTotal = productsPrice - amount;
}

// Function redrawPayment - redraws the HTML for the Amount Paid section
function redrawPayment() {
  let paidIn = "";
  var paidAmount = 0;
  for (var i = 0; i < paymentArray.length; i++) {
    var payValue = parseFloat(paymentArray[i][3], 10);
    var payTitle = paymentArray[i][1];
    var payImage = paymentArray[i][2];
    var payClass = paymentArray[i][4];
    var payAlt = paymentArray[i][5];

    // Draws the payment unit.
    paidIn +=
      '<div class="' + payClass+ ' paidIn" onclick="removePayment(this.id)" id="order-' +
      i +
      '"> <div class="image_line noselect">' +
      '<img src="' +
      payImage 
      + '" alt="'+ payAlt +'">' +
      "</div>" +
      '<p class="title noselect">' +
      payTitle +
      '   $' +
      formatMoney(payValue) +
      "</p>" +
      "</div>";
    paidAmount += parseFloat(payValue);
    
  }
  
  calculatePayment(formatMoney(paidAmount,2));

  // Redraws the payment area screen 
  document.getElementById("paidIn").innerHTML=paidIn;
  document.getElementById("payHolder").innerHTML= `<div aria-live="polite" class="total_label" id="order_total_label">Amount Due:</div> <div aria-live="polite" class="total_amount"  id="order_total">`+("$ " + formatMoney(paymentTotal))+`</div>`;
  // Forces scroll so that you see they item you just added
  scrollToBottom('paidIn');
  document.getElementById("paidIn").setAttribute('aria-hidden', true);
  document.getElementById("paidIn").focus();

}

// Function removeFromCart -  removes selected item from order_Array, calls redrawOrders  
function removeFromCart(p1) {
  var splits = p1.split("-");
  var mykey = parseInt(splits[1]);
  var price_reduction = -1 * parseFloat(order_Array[mykey][3]);
  order_Array.splice([mykey], 1);
  redrawOrders();
  if(order_Array.length == 0){
    buttonswitch='<button class="button disable" onclick="paymentView()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button disable" onclick="paymentView()">Pay Now</button>';
    document.getElementById("paybutton").innerHTML=buttonswitch;
}}

// Function refundView - Redraws page using refund information, invoked when moving from Payment view to Refund view, 
function refundView() {
  refundDue = -1 * formatMoney(paymentTotal);
  refundAmount = 0;
  var refundSwitch = "";
  var inventorySwitch = "";
  inventorySwitch +=
    '<div id="inventory_title" class="section_title">Refund Options</div> <div id="payOptions" class="inventory_list_section">';
  for (let i = 0; i < refundOptions_Array.length; i++) {
    inventorySwitch +=
      '<div class="' +
      refundOptions_Array[i][4] +
      '" id="pay-' +
      refundOptions_Array[i][0] +
      '" onclick="refund(this.id)"><div class="image_line noselect"><img src="' +
      refundOptions_Array[i][2] 
      + '" alt="'+ refundOptions_Array[i][6] +'">' +
      '</div><p class="title noselect">' +
      refundOptions_Array[i][1];
      inventorySwitch += "   $";
      inventorySwitch += formatMoney(refundOptions_Array[i][5]) +
      "</p></div>";
  }

  inventorySwitch += "</div>";

  var buttonswitch =
  '<button class="button disable" onclick="paymentView()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button" onclick="productView()">Edit Order</button>';
 
  refundSwitch +=
    '<div id="order_title" class="section_title">Refunded Amount</div> <div id="refunded" class="order_list_section"></div></div>';

  document.getElementById("first_container").innerHTML=inventorySwitch;
  document.getElementById("second_container").innerHTML=refundSwitch;
  document.getElementById("paybutton").innerHTML=buttonswitch;
  document.getElementById("order_total").innerHTML=("$ " + formatMoney((refundDue - refundAmount)));
  document.getElementById("order_total_label").innerHTML="Refund This Amount:";

  issueRefund(refundDue);
}

// Function issueRefund - For each payment option, checks to see if it is greater than the total amount needed to be refunded, if so, disables.
function issueRefund(stillDue) {
  for (let i = 0; i < refundOptions_Array.length; i++) {
    let refundItemValue = parseFloat(refundOptions_Array[0][3], 10);
    if (refundOptions_Array[i][3] > stillDue) {
      let name = "pay-" + [i];
      document.getElementById(name).classList.add("disable");
    }
  }

  if (stillDue == 0) {
    for (let i = 0; i < refundArray.length; i++) {
      let refundId = 'refund-'+[i];
      //  console.log(refundId);
      document.getElementById(refundId).classList.add("disable");
    }
    buttonswitch= '<button class="button new" onclick="clearOrder()">New Order</button> <button class="button disable" onclick="refundView()">Issue Refund</button> <button class="button disable" onclick="paymentView()">Pay Now</button>'; 
     document.getElementById("paybutton").innerHTML=buttonswitch;
    if(modalPermissions){
     document.getElementById("order_Completed").style.display="block";
     showModal();
    }
  }
}

// Function refund 
// Intakes refund, parses the id passed to the function, reads the information from the refundOptions array, pushes that information to the end of the refundArray.
function refund(id) {
  // Breaks up the ID fed in on "-"
  var splits = id.split("-");
  var mykey = parseInt(splits[1]);

  // Finds the split part inside of the refundOptions Array
  var key = parseInt(refundOptions_Array[mykey][0], 10);
  var payValue = -1 * formatMoney(refundOptions_Array[key][3], 2);
  var payImage = refundOptions_Array[key][2];
  var payTitle = refundOptions_Array[key][1];
  var payClass = refundOptions_Array[key][4];
  var payAlt = refundOptions_Array[key][6];
  refundArray.push([key, payTitle, payImage, payValue, payClass, payAlt]);
  
  //Redraws the refund section
  redrawRefund();
  issueRefund();
}

// Function removeRefund - removes a refund payment, checks that previously disabled refundable amounts are should still be disabled, enables if needed. 
function removeRefund(id) {
  var splits = id.split("-");
  var mykey = parseInt(splits[1]);
  refundArray.splice([mykey], 1);
  redrawRefund();
  
  for (let i = 0; i < refundOptions_Array.length; i++) {
    if (refundOptions_Array[i][3] <= formatMoney(refundTotal)) {
      let name = "pay-" + [i];
      document.getElementById(name).classList.remove("disable");
    }
  }
}

// Function redrawRefund - redraws the HTML for the Refunded Amount section
function redrawRefund() {
  let refunded = "";
  let paidAmount = 0;
  for (var i = 0; i < refundArray.length; i++) {
    var payValue = parseFloat(refundArray[i][3], 10); 
    var payTitle = refundArray[i][1];
    var payImage = refundArray[i][2];
    var payClass = refundArray[i][4];
    var payAlt = refundArray[i][5];
    let showPrice = -1 * parseFloat(refundArray[i][3], 10);
      refunded +=
      '<div class="paidIn '+ payClass +'" onclick="removeRefund(this.id)" id="refund-' +
      i +
      '">' +
      '<div class="image_line  noselect">' +
      '<img src="' +
      payImage +
      '" alt="'+ payAlt +'">' +
      "</div>" +'<p class="title noselect">' +
      payTitle +
     '   $' +
      formatMoney(showPrice) +
      "</p>" +
      "</div>";
    paidAmount += parseFloat(payValue);
  
  }
  calculateRefund(-1 * parseFloat(paidAmount));
  document.getElementById("refunded").innerHTML=refunded;
  scrollToBottom('refunded');
  issueRefund(formatMoney(refundTotal));
  
  document.getElementById("order_total").innerHTML=("$ " + formatMoney(refundTotal));
}

// Function calculateRefund - Calculates the amount still needing to be returned as a refund
function calculateRefund(amount) {
  refundTotal = formatMoney(refundDue) - formatMoney(amount);
  refundTotal = formatMoney(refundTotal);
}

// Function: closeModal - closes the modal popup.
function closeModal(){
  modal.style.display= 'none';
  overlay.style.display = "none";
  clearModal();
};

// Function: Show Modal - Shows the modal popup.
function showModal(){
  modal.style.display = "block";
  overlay.style.display = "block";
};

// Function: clearModal - Hides the modal and wipes its contents.
function clearModal(){
  modal.style.display= 'none';
  overlay.style.display = "none";
  document.getElementById("order_Completed").style.display="none";
  document.getElementById("new_Order").style.display="none";
};

// Function:  ClearPermissions:  If the user decides not to see the modal pop-ups anymore, this changes the permission flag to false, clears and hides teh modal HTML and closes the modal popup.
function clearPermissions() {
  modalPermissions = false;
  clearModal();
  clearOrder();
}

// Function: areYouSure: If modal viewing flag is true, sets the content of the modal to the Are You Sure You Want to Clear this order message.
function areYouSure(){
  if(modalPermissions){
    document.getElementById("new_Order").style.display="block";
    showModal();
   }else{
     clearOrder();
   }
}
