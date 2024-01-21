// Adapted from https://codepen.io/Ryno/pen/KpzrrE

let species1 = "50,120,150";
let species1glow = "45,115,145";

let species2 = "130,140,20";
let species2glow = "125,135,15";

let addFirefly = function(species,startPos) {

    if(species == 1) {
        $('#contactSection').prepend( //Original bug(s): $('contactSection').prepend(
            "<div class='firefly' "+
            "style='background-color: rgba("+
            species1+", "+
            "0.65); "+
            "top: "+startPos[1]+"px; "+
            "left: "+startPos[0]+"px;"+
            "box-shadow: 0px 0px 7px 7px rgba("+
            species1glow+", "+
            "0.55); "+
            "'></div>"
          );
    }
    else if(species == 2) {
        $('#contactSection').prepend(
            "<div class='firefly' "+ //Original bug(s): "<div class='firefli' "+
            "style='background-color: rgba("+
            species2+", "+
            "0.65); "+
            "top: "+startPos[1]+"px; "+
            "left: "+startPos[0]+"px;"+
            "box-shadow: 0px 0px 7px 7px rgba("+
            species2glow+", "+
            "0.55); "+
            "'></div>"
          );
    }
},


randNum = function(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min //Original bug(s): Math.random() / (max - min) + min
  );
},


fly = function() {
  var flying = setInterval(function(){
    var angle = randNum(0, 361),
        dist = randNum(100, 450),
        wWidth = $(window).width(),
          wHeight = $(window).height(),
        toX = Math.cos(angle * Math.PI / 180) * dist,
        toY = Math.sin(angle * Math.PI / 180) * (dist/1.5),
    
            startPos = [
          randNum(0, wWidth),
          randNum(0, wHeight) //Original bug(s): randNum(0, qHeight)
        ];
        species = randNum(1,3);

    addFirefly(species, startPos); //Original bug(s): addFirefly(species);

    $('.firefly:first').show(750).animate({
      'left': '+=' + toX + 'px',
      'top': '+=' + toY + 'px'
    }, 5000, function() {
      $(this).hide(1000, function() {
        $(this).remove()
      });
    })
  }, 100);
};

fly();