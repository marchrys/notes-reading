// This is a JavaScript file
// App module
let app = {
  init: function(){
        //On définit le titre de l'appli
        document.getElementById('app-title').textContent = 'Lecture de notes ' + version;

        let clefsArray = null;
        if(version === 'Lite'){
          clefsArray = clefs.filter(clef => clef.inLite);
        }else{
          clefsArray = clefs;
        }

        clefsArray.forEach(function(item){
            document.getElementById("tabs-container").innerHTML += 
            '<li class="tab">' +
                '<a href="#' + item.containerDiv + '"  id="' + item.containerDiv + '-tab">' + item.name + '</a>' +
            '</li>';

            let clef = new Clef(item);
            // clef.init(item);
        });

        let elem = document.querySelector('.tabs'); 
        let instance = M.Tabs.init(elem, {});
  }
}

document.addEventListener("deviceready", app.init, false);