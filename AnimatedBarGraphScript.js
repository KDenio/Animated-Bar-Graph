/* Animated Bar Graph for Composer - Version 1.2 ***********/
/* Written by Kristopher L Denio - www.kristopherdenio.com */
/* Distributed through FS Hacks - www.fshacks.com **********/
/* Instructions for Install and Use at 
 * www.fshacks.com/animated-bar-graph-v1-2/
 */

/**
 * inViewport jQuery plugin by Roko C.B.
 * http://stackoverflow.com/a/26831113/383904
 * Returns a callback function with an argument holding
 * the current amount of px an element is visible in viewport
 * (The min returned value is 0 (element outside of viewport)
 */
;(function($, win) {
  $.fn.inViewport = function(cb) {
     return this.each(function(i,el) {
       function visPx(){
         var elH = $(el).outerHeight(),
             H = $(win).height(),
             r = el.getBoundingClientRect(), t=r.top, b=r.bottom;
         return cb.call(el, Math.max(0, t>0? Math.min(elH, H-t) : (b<H?b:H)));  
       }
       visPx();
       $(win).on("resize scroll", visPx);
     });
  };
}(jQuery, window));
/** End inViewport Plugin **/

/* Animation function; grows the bar graph */
function growGraphBar(startVal, endVal, graphHeight) {
  var curVal = startVal; // Initialize variable
  var curHeight = 0;
  var animateInterval = 0.005;
  var heightIncrement = (endVal<=goalAmount?(endVal*graphHeight)/(goalAmount-startVal):graphHeight)/(animateTime/animateInterval*1.0); // Obfuscated Math-Fu
  var graphIncrement = (animateInterval*(endVal-startVal)/animateTime);
  var id = setInterval(frame, animateInterval*1000); // set interval for animation
  function frame() { // animation function
    if (curVal >= endVal) { // if we reach the endVal, stop
      curVal = endVal;
      clearInterval(id);
    } else { // if we haven't reached the endVal yet
      curVal += graphIncrement; // increment curVal
      curHeight += heightIncrement; // increment the height of the graph and label
    }
    if(curVal<=goalAmount) { // Stop the bar when it reaches the goal
      $(".FSH-GraphBar").css("height", curHeight.toString() + "px"); // set the graph bar height
    }
    $(".FSH-OverflowBar").css("height", curHeight.toString() + "px"); // set the overflow bar height
    $(".FSH-CurrentAmount").text(valPrefix + Math.floor(curVal).toLocaleString() + valSuffix); // set the label test
    $(".FSH-CurrentAmount").css("bottom", curHeight.toString() + "px"); // set the label height
  }
}

$(document).ready(function() {
  var firstTime = true; // initialize boolean
  var graphHeight = $(".FSH-GraphBackground").height();

  /* initialize graph bar and current amount */
  $(".FSH-CurrentAmount").text(valPrefix + "0" + valSuffix);
  var currentAmountHeight = 1;
  $(".FSH-GraphBar").css("height", "1px");
  $(".FSH-CurrentAmount").css("bottom", "1px");

  /* set graph amounts to user defined values defined in page script; add commas */
  $(".FSH-StartAmount").text(valPrefix + startAmount.toLocaleString() + valSuffix);
  $(".FSH-GoalAmount").text(valPrefix + goalAmount.toLocaleString() + valSuffix);

  /* Check if current amount is greater than goal amount. i.e. Goal Exceeded */
  if (currentAmount>goalAmount) {
    var goalAmountPosition = graphHeight-Math.floor(goalAmount/currentAmount*graphHeight)-10;
    $(".FSH-GoalAmount").css("top", goalAmountPosition.toLocaleString()+"px");
  }

  /* watch for the graph to come into view before beginning animation */
  $(".FSH-GraphBar").inViewport(function(px){ // listen for scrolling
    if(firstTime && px) { // check to make sure this is the first time we see the graph
                          // if we don't do this, the graph will reset on each scroll event
      firstTime = false; 
      growGraphBar(startAmount, currentAmount, graphHeight); // call animation function
    }
  });
});



