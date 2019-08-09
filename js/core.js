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
var modalPermissions = true;
var refundModalPermissions = true;
var paymentTotal = 0;


// refactoring for ease of read
const getById = id => document.getElementById(id);

let modal = getById("modal");
let overlay = getById("overlay");


// Read JSON Datafile for refundOptions
const getRefundOptions = () => {
  let request = new XMLHttpRequest();
  request.open("GET", "./data/refund.json", true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      let data = JSON.parse(request.responseText);
      //  console.log(data);
      data.forEach(function(val, key) {
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
const getPaymentOptions = () => {
  let request = new XMLHttpRequest();
  request.open("GET", "./data/pay.json", true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      let data = JSON.parse(request.responseText);
      //  console.log(data);
      data.forEach(function(val, key) {
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
}

getPaymentOptions();


// Read JSON Datafile for starter inventory and define inventory section in the HTML
const importInventory = () => {
  let request = new XMLHttpRequest();
  request.open("GET", "./data/inventory.json", true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      let data = JSON.parse(request.responseText);
      //  console.log(data);
      data.forEach(function(val, key) {
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
          '<div class="title noselect">' +
          val.title +
          "</div>" +
          '<div class="image_line noselect">' +
          '<img src="' +
          val.imagepath +
          '" alt="' +
          val.alt +
          '">' +
          "</div>" +
          '<div class="price noselect">$' +
          val.price +
          "</div>" +
          "</div>";
      });
      inventorySection = output;
      getById("inventory").innerHTML = output;
    }
  };
  request.send();
}

importInventory();


// Function: formatMoney - beautiful borrowed script that parses the provided amount and applies a .fixed(decimal) to the it amoung other things (logic for thousands place operator)
// May come back and trim the thousands place items out since this application does not need to worry about them.
const formatMoney = (amount, decimalCount, decimal, thousands) => {
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
  }
}


// Function scrollToBottom - Forces scroll to the bottom of container
// Used when payment, refund, or cart containers overflow on add.
const scrollToBottom = id => {
  let scroll = getById(id);
  scroll.scrollTop = scroll.scrollHeight;
}


// Function calculatePrice - Recalculates and rewrites price
const calculatePrice = priceAdd => {
  price += priceAdd;
  getById("order_total").innerHTML = "$ " + formatMoney(price);
}


// Function moveToCart - Moves items to cart
// Parses the id passed to the function and uses that value to get the array key for the item clicked
// Reads the information from the inventoryArray for that item
// Pushes this information to the end of the orderArray.
// Redraws the orders section using redrawOrders() (This function updates cart contents and price)
const moveToCart = p1 => {
  let splits = p1.split("-");
  let mykey = parseInt(splits[1]);
  let key = parseInt(inventory_Array[mykey][0], 10);
  let orderPrice = parseFloat(inventory_Array[key][3]);
  let orderImage = inventory_Array[key][2];
  let orderTitle = inventory_Array[key][1];
  let orderAlt = inventory_Array[key][4];
  order_Array.push([key, orderTitle, orderImage, orderPrice, orderAlt]);
  price = 0;
  redrawOrders();
}


// Function redrawOrders- Redraws order section after add or removal
// Wipes HTML container, loops through the orders array and rebuilds the HTML for the section.
const redrawOrders = () => {
  ordersBlock = "";
  price = 0;
  for (let i = 0; i < order_Array.length; i++) {
    let myprice = parseFloat(order_Array[i][3], 10);
    let mytitle = order_Array[i][1];
    let myimage = order_Array[i][2];

    ordersBlock +=
      '<div class="product" onclick="removeFromCart(this.id)" id="order-' +
      i +
      '">' +
      '<div class="title noselect" aria-live="polite">' +
      mytitle +
      "</div>" +
      '<div class="image_line noselect">' +
      '<img src="' +
      myimage +
      '" alt="' +
      order_Array[i][4] +
      '">' +
      "</div>" +
      '<div class="price noselect">$' +
      formatMoney(myprice) +
      "</div>" +
      "</div>";
    calculatePrice(parseFloat(myprice));
  }
  buttonswitch =
    '<button class="button disable" onclick="areYouSure()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button cta" onclick="paymentView()">Pay Now</button>';
  getById("paybutton").innerHTML = buttonswitch;
  getById("orders").innerHTML = ordersBlock;
  getById("payHolder").innerHTML =
    `<div aria-live="polite" class="total_label" id="order_total_label">Amount Due:</div> <div aria-live="polite" class="total_amount"  id="order_total">` +
    ("$ " + formatMoney(price)) +
    `</div>`;
  // getById("order_total_label").innerHTML="Amount Due:";
  // getById("order_total").innerHTML=("$ " + formatMoney(price));

  scrollToBottom("orders");
}


// Function clearOrder - Clears entire order
// Clears order array, payment Array, and refund Array.  | Redraws Orders Section and resets price
const clearOrder = () => {
  clearModal();
  order_Array = [];

  ordersBlock = "";
  productView();
  price = parseFloat("0.00");
  paymentTotal = 0;

  paymentArray = [];
  refundArray = [];

  buttonswitch =
    '<button class="button disable" onclick="paymentView()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button disable" onclick="paymentView()">Pay Now</button>';
  getById("paybutton").innerHTML = buttonswitch;
  getById("orders").innerHTML = ordersBlock;
  getById("order_total").innerHTML = "$ " + formatMoney(price);

  // Removes color from refund rebadging
  getById("first_container").classList.remove("refund_inv_column");
  getById("second_container").classList.remove("refund_order_column");
  getById("payOptions").classList.remove("refund_list_section");
}


// Function paymentView - Redraws the screen when going from Inventory view to Payment view
// Saves the value of cart inventory in global productsPrice.
const paymentView = () => {
  productsPrice = price;
  let orderSwitch = "";
  let inventorySwitch = "";
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
      paymentOptions_Array[i][2] +
      '" alt="' +
      paymentOptions_Array[i][6] +
      '">' +
      '</div><p class="title noselect">' +
      paymentOptions_Array[i][1];
    inventorySwitch += "   $";
    inventorySwitch += formatMoney(paymentOptions_Array[i][5]) + "</p></div>";
  }

  inventorySwitch += `</div><div id="inventoryBottom" aria-live="polite"></div> `;

  let buttonswitch =
    '<button class="button pale" onclick="areYouSure()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button" onclick="productView()">Edit Order</button>';
  orderSwitch +=
    '<div id="order_title" class="section_title">Amount Paid</div> <div id="paidIn" class="order_list_section"></div></div>';

  // Redraws the entire screen
  getById("second_container").innerHTML = orderSwitch;
  getById("order_total_label").innerHTML = "Amount Due: ";
  getById("first_container").innerHTML = inventorySwitch;
  getById("paybutton").innerHTML = buttonswitch;
  getById("order_total").innerHTML = "$ " + formatMoney(price);
}


// Function Pay - Calculates Payments
// Parses the id passed to the function and uses that value to get the array key for the item clicked
// Reads the information from the paymentOptions array for that item
// Pushes this information to the end of the payment array.
// Redraws the payments section
const pay = id => {
  let splits = id.split("-");
  let mykey = parseInt(splits[1]);
  let key = parseInt(paymentOptions_Array[mykey][0], 10);
  let payValue = parseFloat(paymentOptions_Array[key][3]);
  let payImage = paymentOptions_Array[key][2];
  let payTitle = paymentOptions_Array[key][1];
  let paymentClass = paymentOptions_Array[key][4];
  let paymentAlt = paymentOptions_Array[key][6];
  paymentArray.push([
    key,
    payTitle,
    payImage,
    payValue,
    paymentClass,
    paymentAlt
  ]);
  redrawPayment();
  orderStatus();
}


// Function Order Status -  Checks for state of cart
// If amount is greater than 0 prompt to pay or clear order
// If less than 0, prompt to issue refund (activate Issue Refund button and pale New Order button)
// Otherwise payment total equals zero, so activate New Order button and show modal for Order Completed.
const orderStatus = () => {
  let buttonswitch;
  if (paymentTotal > 0) {
    buttonswitch =
      '<button class="button pale" onclick="areYouSure()">New Order</button> <button aria-live="polite" class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button" onclick="productView()">Edit Order</button>';
  } else if (paymentTotal < 0) {
    for (let i = 0; i < paymentOptions_Array.length; i++) {
      let payId = "pay-" + [i];
      getById(payId).classList.add("disable");
      getById("paidIn").classList.add("disable");
    }
    buttonswitch =
      '<button class="button pale" onclick="areYouSure()">New Order</button> <button aria-live="polite" class="button refund" onclick="refundView()">Issue Refund</button> <button class="button" onclick="productView()">Edit Order</button>';

    if (refundModalPermissions) {
      getById("issue_Refund").style.display = "block";
      showModal();
    }
  } else {
    getById("payOptions").classList.add("disable");
    getById("paidIn").classList.add("disable");
    buttonswitch =
      '<button class="button new" onclick="clearOrder()">New Order</button> <button aria-live="polite" class="button disable" onclick="refundView()">Issue Refund</button> <button class="button disable" onclick="paymentView()">Pay Now</button>';

    if (modalPermissions) {
      getById("order_Completed").style.display = "block";
      showModal();
    }
  }

  getById("paybutton").innerHTML = buttonswitch;
}


//Function paymentEnable
// Checks that previously disabled payment amounts are should still be disabled, enables if needed.
const paymentEnable = () => {
  for (let i = 0; i < paymentOptions_Array.length; i++) {
    let payId = "pay-" + [i];
    getById(payId).classList.remove("disable");
  }
}


// Function removePayment
// Receives the Payment's ID as an argument | Parses the payment ID to get the array key
// Removes the specific payment from the paymentArray | Redraws Payment section using the updated array
const removePayment = id => {
  // Pulls the array key from the payment's ID.
  let splits = id.split("-");
  let mykey = parseInt(splits[1]);
  paymentArray.splice([mykey], 1);

  // Redraws the payment section using the updated array
  redrawPayment();
  paymentEnable();
  orderStatus();
}


// Function productView - Invoked when returning to product view from Payment or refund view
// Redraws the Inventory and the cart  | Wipes payment and refund arrays
const productView = () => {
  let orderReturn = "";
  let inventoryReturn = "";
  let buttonswitch =
    '<button class="button pale" onclick="areYouSure()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button" onclick="paymentView()">Pay Now</button>';
  inventoryReturn +=
    '<div id="inventory_title" class="section_title">Our Products</div> <div id="payOptions" class="inventory_list_section">' +
    inventorySection +
    `</div><div id="inventoryBottom" aria-live="polite"></div> `;
  orderReturn +=
    '<div id="order_title" class="section_title">This Order</div><div class="order_list_section" id="orders">' +
    ordersBlock +
    "</div></div>";

  // Clears the payment and refund arrays (if you go back to the Edit the order, all payment and refund progress is wiped)
  paymentArray = [];
  refundArray = [];

  // Redraws the entire screen
  getById("first_container").innerHTML = inventoryReturn;
  getById("second_container").innerHTML = orderReturn;
  getById("paybutton").innerHTML = buttonswitch;
  getById("order_total").innerHTML = "$ " + formatMoney(price);
  getById("order_total_label").innerHTML = "Amount Due: ";

  // Removes color from refund rebadging
  getById("first_container").classList.remove("refund_inv_column");
  getById("second_container").classList.remove("refund_order_column");
  getById("payOptions").classList.remove("refund_list_section");
}


// Function calculatePayment - receives amount paid, subtracts this from the total amount due.
const calculatePayment = amount => paymentTotal = productsPrice - amount;

// Function redrawPayment - redraws the HTML for the Amount Paid section
const redrawPayment =() => {
  let paidIn = "";
  let paidAmount = 0;
  for (let i = 0; i < paymentArray.length; i++) {
    let payValue = parseFloat(paymentArray[i][3], 10);
    let payTitle = paymentArray[i][1];
    let payImage = paymentArray[i][2];
    let payClass = paymentArray[i][4];
    let payAlt = paymentArray[i][5];

    // Draws the payment unit.
    paidIn +=
      '<div class="' +
      payClass +
      ' paidIn" onclick="removePayment(this.id)" id="order-' +
      i +
      '"> <div class="image_line noselect">' +
      '<img src="' +
      payImage +
      '" alt="' +
      payAlt +
      '">' +
      "</div>" +
      '<p class="title noselect">' +
      payTitle +
      "   $" +
      formatMoney(payValue) +
      "</p>" +
      "</div>";
    paidAmount += parseFloat(payValue);
  }

  calculatePayment(formatMoney(paidAmount, 2));

  // Redraws the payment area screen
  getById("paidIn").innerHTML = paidIn;
  getById("payHolder").innerHTML =
    `<div aria-live="polite" class="total_label" id="order_total_label">Amount Due:</div> <div aria-live="polite" class="total_amount"  id="order_total">` +
    ("$ " + formatMoney(paymentTotal)) +
    `</div>`;
  // Forces scroll so that you see they item you just added
  scrollToBottom("paidIn");
  getById("paidIn").setAttribute("aria-hidden", true);
  getById("paidIn").focus();
}


// Function removeFromCart -  removes selected item from order_Array, calls redrawOrders
const removeFromCart = p1 => {
  let splits = p1.split("-");
  let mykey = parseInt(splits[1]);
  // let price_reduction = -1 * parseFloat(order_Array[mykey][3]);
  order_Array.splice([mykey], 1);
  redrawOrders();
  if (order_Array.length == 0) {
    buttonswitch =
      '<button class="button disable" onclick="paymentView()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button disable" onclick="paymentView()">Pay Now</button>';
    getById("paybutton").innerHTML = buttonswitch;
  }
}


// Function refundView - Redraws page using refund information, invoked when moving from Payment view to Refund view,
const refundView = () => {
  refundDue = -1 * formatMoney(paymentTotal);
  refundAmount = 0;
  let refundSwitch = "";
  let inventorySwitch = "";
  inventorySwitch +=
    '<div id="inventory_title" class="section_title">Refund Options</div> <div id="payOptions" class="inventory_list_section">';
  for (let i = 0; i < refundOptions_Array.length; i++) {
    inventorySwitch +=
      '<div class="' +
      refundOptions_Array[i][4] +
      '" id="pay-' +
      refundOptions_Array[i][0] +
      '" onclick="refund(this.id)"><div class="image_line noselect"><img src="' +
      refundOptions_Array[i][2] +
      '" alt="' +
      refundOptions_Array[i][6] +
      '">' +
      '</div><p class="title noselect">' +
      refundOptions_Array[i][1];
    inventorySwitch += "   $";
    inventorySwitch += formatMoney(refundOptions_Array[i][5]) + "</p></div>";
  }

  inventorySwitch += `</div><div id="inventoryBottom" aria-live="polite"></div> `;

  let buttonswitch =
    '<button class="button disable" onclick="paymentView()">New Order</button> <button class="button disable" onclick="paymentView()">Issue Refund</button> <button class="button" onclick="productView()">Edit Order</button>';

  refundSwitch +=
    '<div id="order_title" class="section_title">Refunded Amount</div> <div id="refunded" class="order_list_section"></div></div>';

  let x = getById("first_container");

  getById("first_container").innerHTML = inventorySwitch;
  getById("second_container").innerHTML = refundSwitch;
  getById("paybutton").innerHTML = buttonswitch;
  getById("order_total").innerHTML =
    "$ " + formatMoney(refundDue - refundAmount);
  getById("order_total_label").innerHTML = "Refund This Amount:";
  getById("inventory_title").classList.add("refund_section_title");
  getById("order_title").classList.add("refund_section_title");

  getById("first_container").classList.add("refund_inv_column");
  getById("second_container").classList.add("refund_order_column");
  getById("order_title").classList.add("refund_section_title");
  getById("payOptions").classList.add("refund_list_section");
  getById("refunded").classList.add("refund_list_section");
  getById("inventoryBottom").classList.add("refund_list_section");

  issueRefund(refundDue);
}


// Function issueRefund - For each payment option, checks to see if it is greater than the total amount needed to be refunded, if so, disables.
const issueRefund = stillDue => {
  for (let i = 0; i < refundOptions_Array.length; i++) {
    let refundItemValue = parseFloat(refundOptions_Array[0][3], 10);
    if (refundOptions_Array[i][3] > stillDue) {
      let name = "pay-" + [i];
      getById(name).classList.add("disable");
    }
  }

  if (stillDue == 0) {
    for (let i = 0; i < refundArray.length; i++) {
      let refundId = "refund-" + [i];
      //  console.log(refundId);
      getById(refundId).classList.add("disable");
    }
    buttonswitch =
      '<button class="button new" onclick="clearOrder()">New Order</button> <button class="button disable" onclick="refundView()">Issue Refund</button> <button class="button disable" onclick="paymentView()">Pay Now</button>';
    getById("paybutton").innerHTML = buttonswitch;
    if (modalPermissions) {
      getById("order_Completed").style.display = "block";
      showModal();
    }
  }
}


// Function refund
// Intakes refund, parses the id passed to the function, reads the information from the refundOptions array, pushes that information to the end of the refundArray.
const refund = id => {
  // Breaks up the ID fed in on "-"
  let splits = id.split("-");
  let mykey = parseInt(splits[1]);

  // Finds the split part inside of the refundOptions Array
  let key = parseInt(refundOptions_Array[mykey][0], 10);
  let payValue = -1 * formatMoney(refundOptions_Array[key][3], 2);
  let payImage = refundOptions_Array[key][2];
  let payTitle = refundOptions_Array[key][1];
  let payClass = refundOptions_Array[key][4];
  let payAlt = refundOptions_Array[key][6];
  refundArray.push([key, payTitle, payImage, payValue, payClass, payAlt]);

  //Redraws the refund section
  redrawRefund();
  issueRefund();
}


// Function removeRefund - removes a refund payment, checks that previously disabled refundable amounts are should still be disabled, enables if needed.
const removeRefund = id => {
  let splits = id.split("-");
  let mykey = parseInt(splits[1]);
  refundArray.splice([mykey], 1);
  redrawRefund();

  for (let i = 0; i < refundOptions_Array.length; i++) {
    if (refundOptions_Array[i][3] <= formatMoney(refundTotal)) {
      let name = "pay-" + [i];
      getById(name).classList.remove("disable");
    }
  }
}


// Function redrawRefund - redraws the HTML for the Refunded Amount section
const redrawRefund = () => {
  let refunded = "";
  let paidAmount = 0;
  for (let i = 0; i < refundArray.length; i++) {
    let payValue = parseFloat(refundArray[i][3], 10);
    let payTitle = refundArray[i][1];
    let payImage = refundArray[i][2];
    let payClass = refundArray[i][4];
    let payAlt = refundArray[i][5];
    let showPrice = -1 * parseFloat(refundArray[i][3], 10);
    refunded +=
      '<div class="paidIn ' +
      payClass +
      '" onclick="removeRefund(this.id)" id="refund-' +
      i +
      '">' +
      '<div class="image_line  noselect">' +
      '<img src="' +
      payImage +
      '" alt="' +
      payAlt +
      '">' +
      "</div>" +
      '<p class="title noselect">' +
      payTitle +
      "   $" +
      formatMoney(showPrice) +
      "</p>" +
      "</div>";
    paidAmount += parseFloat(payValue);
  }
  calculateRefund(-1 * parseFloat(paidAmount));
  getById("refunded").innerHTML = refunded;
  scrollToBottom("refunded");
  issueRefund(formatMoney(refundTotal));

  getById("order_total").innerHTML = "$ " + formatMoney(refundTotal);
}


// Function calculateRefund - Calculates the amount still needing to be returned as a refund
const calculateRefund = amount => {
  refundTotal = formatMoney(refundDue) - formatMoney(amount);
  refundTotal = formatMoney(refundTotal);
}


// Function: closeModal - closes the modal popup.
const closeModal = () => {
  modal.style.display = "none";
  overlay.style.display = "none";
  clearModal();
}


// Function: Show Modal - Shows the modal popup.
const showModal = () => {
  modal.style.display = "block";
  overlay.style.display = "block";
}


// Function: clearModal - Hides the modal and wipes its contents.
const clearModal = () => {
  modal.style.display = "none";
  overlay.style.display = "none";
  getById("order_Completed").style.display = "none";
  getById("new_Order").style.display = "none";
  getById("issue_Refund").style.display = "none";
}


// Function:  clearPermissions:  If the user decides not to see the modal pop-ups anymore, this changes the permission flag to false, clears and hides teh modal HTML and closes the modal popup.
const clearPermissions = () => {
  modalPermissions = false;
  refundModalPermissions = false;
  clearModal();
  clearOrder();
}

// Function:  clickToRefund:  Clears modal, shows refund view.
const clickToRefund = () => {
  clearModal();
  refundView();
}

// Function:  clearToRefund:  Clears modal, sets flag for refund modal pop-up to false, shows refund view.
const clearToRefund = () => {
  refundModalPermissions = false;
  clearModal();
  refundView();
}


// Function: areYouSure: If modal viewing flag is true, sets the content of the modal to the Are You Sure You Want to Clear this order message.
const areYouSure = () => {
  if (modalPermissions) {
    getById("new_Order").style.display = "block";
    showModal();
  } else {
    clearOrder();
  }
}
