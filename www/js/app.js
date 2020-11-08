// This is a JavaScript file
// App module
let app = {
  init: function(){
        clefs.forEach(function(item){
            document.getElementById("tabs-container").innerHTML += 
            '<li class="tab">' +
                '<a href="#' + item.containerDiv + '"  id="' + item.containerDiv + '-tab">' + item.name + '</a>' +
            '</li>';

            let clef = new Clef(item);
            // clef.init(item);
        }) 

        let elem = document.querySelector('.tabs'); 
        let instance = M.Tabs.init(elem, {});
  }
}

document.addEventListener("deviceready", app.init, false);