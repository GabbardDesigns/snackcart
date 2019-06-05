
// function randomNumber(upper) {
//     return Math.floor( Math.random()* upper) +1;
// };

// var counter = 0;
// while (counter < 10) {
//     var randNum = randomNumber(6);
//     document.write(randNum + '');
//     counter+= +1;
// }


$.getJSON('./data/inventory.json',function(data){
console.log(data);
var output ='';
$.each(data, function(key,val){
    output += '<div class="product">'+'<p class="title">'+val.title+'</p>'+'<div class="image_line">'+'<img src="'+val.imagepath+'">'+'</div>'+'<p class="price">$'+val.price+'</p>'+'</div>';
});
$('#update').html(output);
});