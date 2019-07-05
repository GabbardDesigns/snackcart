<h1>javascript details</h1>
<h2>Modified Existing Functions (2) </h2>
  <div>
<h5>formatMoney</h5>
<p>Beautiful borrowed script that parses the provided amount and applies a .fixed(decimal) to the it amoung other things (logic for thousands place operator).</p>
<h5>scrollToBottom</h5>
<p>Forces scroll to the bottom of container, used when payment, refund, or cart containers overflow on add.</p>
</div>

<h2>Custom Functions (24)</h2>

<h3>Global Functions (1)</h3>
<h5>orderStatus</h5>
<p>Checks for state of cart, if amount is greater than 0 prompt to pay, if less than 0 refund, if 0 new order.</p>


<h3>Functions dealing with Order/Inventory Functionality (5)</h3>
<h5>redrawOrders</h5>
<p>Recalculates and rewrites price.</p>

<h5>moveToCart</h5>
<p>Moves items to cart, calls redrawOrders to update cart contents and price.</p>

<h5>redrawOrders</h5>
<p>Redraws order section after add or removal, wipes HTML container, loops through the orders array and rebuilds the HTML for the section.</p>

<h5>clearOrder</h5>
<p>Clears entire order, clears and redraws Orders Section and resets price.</p>

<h5>productView</h5>
<p>Invoked when returning to product view from Payment view, redraws the Inventory and the cart, wipes payment and refund arrays.</p>

<h3>Functions dealing with Payment Functionality (7)</h3>
<h5>paymentView</h5>
<p>Redraws the Screen when going from Inventory view to Payment view, saves the value of cart inventory in global productsPrice.</p>

<h5>pay</h5>
<p>Calculates Payment, Parses the id passed to the function, reads the information from the paymentOptions array, pushes that information to the end of the payment array.</p>

<h5>paymentEnable</h5>
<p>Checks that previously disabled payment amounts are should still be disabled, enables if needed.</p>

<h5>removePayment</h5>
<p>Removes payment from Array, calls redrawPayment and OrderStatus.</p> 

<h5>calculatePayment</h5>
<p>Receives amount paid, subtracts this from the total amount due.</p> 

<h5>redrawPayment</h5>
<p>Redraws the HTML for the Amount Paid section.</p>

<h5>removeFromCart</h5>
<p>Removes selected item from order_Array, calls redrawOrders.</p>

<h3>Functions dealing with Refund Functionality (6)</h3>
<h5>refundView</h5>
<p>Redraws page using refund information, invoked when moving from Payment view to Refund view.</p>

<h5>issueRefund</h5>
<p>For each payment option, checks to see if it is greater than the total amount needed to be refunded, if so, disables.</p>

<h5>refund</h5>
<p>Intakes refund, parses the id passed to the function, reads the information from the refundOptions array, pushes that information to the end of the refundArray.</p>

<h5>removeRefund</h5>
<p>Removes a refund payment, checks that previously disabled refundable amounts are should still be disabled, enables if needed. </p>

<h5>redrawRefund</h5>
<p>Redraws the HTML for the Refunded Amount section.</p>

<h5>calculateRefund</h5>
<p>Calculates the amount still needing to be returned as a refund.</p>

<h3>Functions dealing with Modal Functionality (5)</h3>
<h5>closeModal</h5></span>
<p>Closes the modal popup.</p>

<h5>Show Modal</h5>
<p>Shows the modal popup.</p>

<h5>clearModal</h5>
<p>Hides the modal and wipes its contents.</p>

<h5>ClearPermissions</h5>
<p>If the user decides not to see the modal pop-ups anymore, this changes the permission flag to false, clears and hides teh modal HTML and closes the modal popup.</p>

<h5>areYouSure</h5>
<p>If modal viewing flag is true, sets the content of the modal to the Are You Sure You Want to Clear this order message.</p>
