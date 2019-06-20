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

// formats currency
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
    console.log(e);
  }
}

// Read JSON Datafile for starter inventory
$.getJSON("./data/inventory.json", function(data) {
  $.each(data, function(key, val) {
    inventory_Array.push([
      key,
      val.title,
      val.imagepath,
      parseFloat(val.price, 10)
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
      '">' +
      "</div>" +
      '<p class="price noselect">$' +
      val.price +
      "</p>" +
      "</div>";
  });
  inventorySection = output;
  $("#inventory").html(output);
});

// Recalculate and rewrite price
function calculatePrice(priceAdd) {
  price += priceAdd;
  $("#order_total").html("$ " + formatMoney(price));
}

//use each to write to order arrays
document.addEventListener("click", event => {
  console.log(event.target.id);
});

// Moves items to cart, calls calculatePrice to update price
function moveToCart(p1) {
  var splits = p1.split("-");
  var mykey = parseInt(splits[1]);
  var key = parseInt(inventory_Array[mykey][0], 10);
  var orderPrice = parseFloat(inventory_Array[key][3]);
  var orderImage = inventory_Array[key][2];
  var orderTitle = inventory_Array[key][1];
  order_Array.push([key, orderTitle, orderImage, orderPrice]);
  price = 0;
  redrawOrders();
}

// Redraws order section after add or removal
function redrawOrders() {
  ordersBlock = "";
  price = 0;
  for (var i = 0; i < order_Array.length; i++) {
    var myprice = parseFloat(order_Array[i][3], 10);
    var mytitle = order_Array[i][1];
    var myimage = order_Array[i][2];
    console.log("My Price is " + myprice);
    ordersBlock +=
      '<div class="product" onclick="removeFromCart(this.id)" id="order-' +
      i +
      '">' +
      '<p class="title noselect">' +
      mytitle +
      "</p>" +
      '<div class="image_line noselect">' +
      '<img src="' +
      myimage +
      '">' +
      "</div>" +
      '<p class="price noselect">$' +
      formatMoney(myprice) +
      "</p>" +
      "</div>";
    calculatePrice(parseFloat(myprice));
  }
  $("#orders").html(ordersBlock);
  $("#order_total").html("$ " + formatMoney(price));
}

// Clears entire order, clears and redraws Orders Section and resets price
function clearOrder() {
  order_Array = [];
  console.log(order_Array);
  ordersBlock = "";
  productView();
  price = parseFloat("0.00");
  $("#orders").html(ordersBlock);
  $("#order_total").html("$ " + formatMoney(price));
  paymentArray = [];
  refundArray = [];
}

function paymentView() {
  productsPrice = price;
  var orderSwitch = "";
  var inventorySwitch = "";
  inventorySwitch +=
    '<div id="inventory_title" class="section_title">Payment Options</div> <div id="payOptions" class="inventory_list_section">';
  // Read JSON Datafile for pay info
  $.getJSON("./data/pay.json", function(data) {
    $.each(data, function(key, val) {
      paymentOptions_Array.push([
        key,
        val.title,
        val.imagepath,
        val.price,
        val.type,
        val.value
      ]);
      inventorySwitch +=
        '<div class="' +
        val.type +
        '" id="pay-' +
        key +
        '" onclick="pay(this.id)"><div class="image_line"><img src="' +
        val.imagepath +
        '"></div><p class="title">' +
        val.title +
        "<br>$" +
        formatMoney(val.price) +
        "</p></div>";
    });
    inventorySwitch += "</div>";
    $("#first_container").html(inventorySwitch);

    var buttonswitch =
      '<button class="pay" onclick="productView()">Edit Order</button>';
    $("#paybutton").html(buttonswitch);

    orderSwitch +=
      '<div id="order_title" class="section_title">Amount Paid</div> <div id="paidIn" class="order_list_section"></div></div>';
    $("#second_container").html(orderSwitch);
  });
  $("#order_total_label").html("Amount Due: ");
  refundArray = [];
}

//Splits payment
function pay(p1) {
  var splits = p1.split("-");
  var mykey = parseInt(splits[1]);
  var key = parseInt(paymentOptions_Array[mykey][0], 10);
  var payValue = parseFloat(paymentOptions_Array[key][3]);
  var payImage = paymentOptions_Array[key][2];
  var payTitle = paymentOptions_Array[key][1];
  paymentArray.push([key, payTitle, payImage, payValue]);
  redrawPayment();
  orderStatus();
}

function orderStatus() {
  var buttonswitch;
  if (paymentTotal > 0) {
    buttonswitch =
      '<button class="pay" onclick="paymentView()">Pay Now</button>';
  } else if (paymentTotal < 0) {
    buttonswitch =
      '<button class="pay refund" onclick="refundView()">Issue Refund</button>';
    $("#paybutton").html(buttonswitch);
  } else {
    buttonswitch =
      '<button class="pay new" onclick="clearOrder()">New Order</button>';
    $("#paybutton").html(buttonswitch);
  }
}

function removePayment(id) {
  var splits = id.split("-");
  var mykey = parseInt(splits[1]);
  var price_increase = parseFloat(paymentArray[0][3]);
  console.log("Now it is : " + paymentArray);
  paymentArray.splice([mykey], 1);
  console.log("Now it is : " + paymentArray);
  redrawPayment();
  orderStatus();
}

function productView() {
  var orderReturn = "";
  var inventoryReturn = "";
  var buttonswitch =
    '<button class="pay" onclick="paymentView()">Pay Now</button>';
  inventoryReturn +=
    '<div id="inventory_title" class="section_title">Our Products</div> <div id="payOptions" class="inventory_list_section">' +
    inventorySection +
    "</div>";
  orderReturn +=
    '<div id="order_title" class="section_title">This Order</div><div class="order_list_section" id="orders">' +
    ordersBlock +
    "</div></div>";
  $("#first_container").html(inventoryReturn);
  $("#second_container").html(orderReturn);
  $("#paybutton").html(buttonswitch);
  $("#order_total").html("$ " + formatMoney(productsPrice));
  paymentArray = [];
  refundArray = [];
  $("#order_total_label").html("Total:");
}

function calculatePayment(amount) {
  paymentTotal = productsPrice - amount;
}

function redrawPayment() {
  let paidIn = "";
  var paidAmount = 0;
  for (var i = 0; i < paymentArray.length; i++) {
    var payValue = parseFloat(paymentArray[i][3], 10);
    var payTitle = paymentArray[i][1];
    var payImage = paymentArray[i][2];
    console.log("My value is " + payValue);
    paidIn +=
      '<div class="product" onclick="removePayment(this.id)" id="order-' +
      i +
      '">' +
      '<p class="title">' +
      payTitle +
      "</p>" +
      '<div class="image_line">' +
      '<img src="' +
      payImage +
      '">' +
      "</div>" +
      '<p class="price">$' +
      formatMoney(payValue) +
      "</p>" +
      "</div>";
    paidAmount += parseFloat(payValue);
    console.log("Total paid so far is " + paidAmount);
  }

  calculatePayment(parseFloat(paidAmount));
  $("#paidIn").html(paidIn);
  $("#order_total").html("$ " + formatMoney(paymentTotal));
}

function removeFromCart(p1) {
  var splits = p1.split("-");
  var mykey = parseInt(splits[1]);
  var price_reduction = -1 * parseFloat(order_Array[mykey][3]);
  order_Array.splice([mykey], 1);
  redrawOrders();
}

function refundView() {
  refundDue = -1 * paymentTotal;
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
      '" onclick="refund(this.id)"><div class="image_line"><img src="' +
      refundOptions_Array[i][2] +
      '"></div><p class="title">' +
      refundOptions_Array[i][1] +
      "<br>$" +
      formatMoney(refundOptions_Array[i][5]) +
      "</p></div>";
  }

  inventorySwitch += "</div>";
  $("#first_container").html(inventorySwitch);

  var buttonswitch =
    '<button class="pay" onclick="productView()">Edit Order</button>';
  $("#paybutton").html(buttonswitch);

  refundSwitch +=
    '<div id="order_title" class="section_title">Refunded Amount</div> <div id="refunded" class="order_list_section"></div></div>';
  $("#second_container").html(refundSwitch);
  $("#order_total_label").html("Refund This Amount:");
  $("#order_total").html("$ " + formatMoney(refundDue - refundAmount));

  issueRefund(refundDue);
}

function issueRefund(stillDue) {
  for (let i = 0; i < refundOptions_Array.length; i++) {
    let refundItemValue = parseFloat(refundOptions_Array[0][3], 10);
    if (refundOptions_Array[i][3] > stillDue) {
      let name = "pay-" + [i];
      console.log("Element Name is " + name);
      document.getElementById(name).classList.add("disable");
    }
  }
  if (stillDue == 0) {
    buttonswitch =
      '<button class="pay new" onclick="clearOrder()">New Order</button>';
    $("#paybutton").html(buttonswitch);
  }
}

//Splits payment
function refund(id) {
  var splits = id.split("-");
  var mykey = parseInt(splits[1]);
  var key = parseInt(refundOptions_Array[mykey][0], 10);
  var payValue = -1 * formatMoney(refundOptions_Array[key][3], 2);
  var payImage = refundOptions_Array[key][2];
  var payTitle = refundOptions_Array[key][1];
  refundArray.push([key, payTitle, payImage, payValue]);
  redrawRefund();
  issueRefund();
  //  orderStatus();
}

function removeRefund(id) {
  var splits = id.split("-");
  var mykey = parseInt(splits[1]);
  refundArray.splice([mykey], 1);
  redrawRefund();

  for (let i = 0; i < refundOptions_Array.length; i++) {
    if (refundOptions_Array[i][3] <= formatMoney(refundTotal)) {
      let name = "pay-" + [i];
      console.log("Element Name is " + name);
      document.getElementById(name).classList.remove("disable");
    }
  }
}

function redrawRefund() {
  let refunded = "";
  let paidAmount = 0;
  for (var i = 0; i < refundArray.length; i++) {
    var payValue = parseFloat(refundArray[i][3], 10);
    var payTitle = refundArray[i][1];
    var payImage = refundArray[i][2];
    let showPrice = -1 * parseFloat(refundArray[i][3], 10);
    console.log("My value is " + payValue);
    refunded +=
      '<div class="product" onclick="removeRefund(this.id)" id="refund-' +
      i +
      '">' +
      '<p class="title">' +
      payTitle +
      "</p>" +
      '<div class="image_line">' +
      '<img src="' +
      payImage +
      '">' +
      "</div>" +
      '<p class="price">$' +
      formatMoney(showPrice) +
      "</p>" +
      "</div>";
    paidAmount += parseFloat(payValue);
    console.log("Total paid so far is " + paidAmount);
  }
  calculateRefund(-1 * parseFloat(paidAmount));
  issueRefund(formatMoney(refundTotal));

  $("#refunded").html(refunded);
  $("#order_total").html("$ " + formatMoney(refundTotal.toFixed(2)));
}

// Read JSON Datafile for refund info
$.getJSON("./data/refund.json", function(data) {
  $.each(data, function(key, val) {
    refundOptions_Array.push([
      key,
      val.title,
      val.imagepath,
      val.price,
      val.type,
      val.value
    ]);
  });
});

function calculateRefund(amount) {
  refundTotal = refundDue - amount;
}
