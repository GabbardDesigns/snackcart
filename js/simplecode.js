
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
var output = '<ul>';  
$.each(data, function(key,val){
  output += '<li>'+ val.name + " " + val.age+ '</li>';
});
output += '</ul>';
$('#update').html(output);
});