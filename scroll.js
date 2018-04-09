var isScrolling;
var scrolldelay;


var largeur = window.innerWidth;

  if(largeur > 1024){
    function pageScroll() {
          window.scrollBy(0,1);
                scrolldelay = setTimeout('pageScroll()',25); isScrolling = true;
          }
          if(!isScrolling) {
              pageScroll();
          } else {
                isScrolling = false; clearTimeout(scrolldelay);
          }

        }else{
          console.log(" ");
        }
