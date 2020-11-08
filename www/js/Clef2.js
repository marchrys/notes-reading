class Clef {

    constructor(clefData){
        this.questionId = 0;
        this.questionNoteNameId = 0;
        this.responseNoteNameId = 0;

        this.clefData = clefData;
        
        this.clefData.containerDiv = document.getElementById(clefData.containerDiv);
 
        // On crée les conteneurs pour l'entraînement et les options
        this.clefData.containerDiv.innerHTML += 
        '<h1>' + this.clefData.name +  '</h1>' +
        '<ul class="collapsible">' +
            '<li class="training">' +
                '<div class="collapsible-header"><i class="fas fa-chalkboard"></i></i>Entraînement</div>' +
                '<div class="collapsible-body"></div>' +
            '</li>' +
            '<li class="settings">' +
                '<div class="collapsible-header"><i class="fas fa-cog"></i>Options</div>' +
                '<div class="collapsible-body"></div>' +
            '</li>' +
        '</ul>';

        let collapsibleElems = document.querySelectorAll('.collapsible');
        let collapsibleInstances = M.Collapsible.init(collapsibleElems, {});

        let collapsible = this.clefData.containerDiv.querySelector(".collapsible");
        let training = collapsible.querySelector(".training").querySelector(".collapsible-body");
 
        training.innerHTML += 
        '<section class="' + this.clefData.containerDiv.id + '-score"></section>' +
        '<section class="musiqwik"></section>' + 
        '<section class="' + this.clefData.containerDiv.id + '-feedback">&nbsp;</section>' +
        '<section class="buttons-container"></section>' +
        '<a class="waves-effect waves-light btn ' + this.clefData.containerDiv.id + '-new-question-btn">Nouvelle question</a>';

        let buttonsContainer = training.querySelector(".buttons-container");
        noteNames.forEach(function(item, index){
            buttonsContainer.innerHTML += '<a class="waves-effect waves-light btn action-btn ' + this.clefData.containerDiv.id + '-response-btn" data-noteid="' + parseInt(index+1) + '">' + item.name + '</a>';
        }.bind(this));

        //On cible tous les boutons permettant de répondre
        buttonsContainer.querySelectorAll("." + this.clefData.containerDiv.id + "-response-btn").forEach(function(item){
            item.addEventListener("click", this.handleResponseButtonClick.bind(this));
            item.classList.add("disabled");
        }.bind(this));

        //On cible le bouton permettant de générer une nouvelle question
        let newQuestionButton = training.querySelector("." + this.clefData.containerDiv.id + "-new-question-btn");
        newQuestionButton.addEventListener("click", this.handleNewQuestionButtonClick.bind(this));

        let settings = collapsible.querySelector(".settings").querySelector(".collapsible-body");

        //On crée le contenu des options
        settings.innerHTML += 
        '<div class="input-field col s12">' +
          '<select id="' + this.clefData.containerDiv.id + '-lowest-note-select"></select>' +
          '<label>Note la plus grave</label>' +
        '</div>' +
        '<div class="input-field col s12">' +
          '<select id="' + this.clefData.containerDiv.id + '-highest-note-select"></select>' +
          '<label>Note la plus aigüe</label>' +
        '</div>';

        // We retrieve all selects
        const lowestNoteSelect = document.getElementById(this.clefData.containerDiv.id + '-lowest-note-select');
        const highestNoteSelect = document.getElementById(this.clefData.containerDiv.id + '-highest-note-select');

        notes.forEach((note, index) => {
          let noteOption = document.createElement('option');
          noteOption.innerHTML = this.clefData.musNotation + note.musNotation + musNotation.barline;
          noteOption.value = note.id;
          lowestNoteSelect.appendChild(noteOption);
        });
        notes.forEach((note, index) => {
          let noteOption = document.createElement('option');
          noteOption.innerHTML = this.clefData.musNotation + note.musNotation + musNotation.barline;
          noteOption.value = note.id;
          highestNoteSelect.appendChild(noteOption);
        });
        
        let questionLimits = settings.querySelector(".musiqwik");

        //Si la clé du localStorage n'existe pas on la crée et on suavegarde notre objet settingsAndStats,
        //sinon on importe le contenu de la clé dans l'objet
        if(localStorage.getItem(this.clefData.containerDiv.id + "-settings-and-stats") === null){
            this.storeSettingsAndStats();
        }else{
            this.loadSettingsAndStats();
        };

        lowestNoteSelect.value = this.clefData.settingsAndStats.lowestNoteId;
        highestNoteSelect.value = this.clefData.settingsAndStats.highestNoteId;

        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems, {});

        lowestNoteSelect.addEventListener('change', this.onLowestNoteChange.bind(this));
        highestNoteSelect.addEventListener('change', this.onHighestNoteChange.bind(this));


        this.displayScore();
        this.displayQuestion();
        this.displayLevelLimits();
    }

    loadSettingsAndStats(){
        this.clefData.settingsAndStats = JSON.parse(localStorage.getItem(this.clefData.containerDiv.id + "-settings-and-stats"));
    }

    storeSettingsAndStats(){
        localStorage.setItem(this.clefData.containerDiv.id + "-settings-and-stats", JSON.stringify(this.clefData.settingsAndStats));
    }

    displayQuestion(){
        let collapsible = this.clefData.containerDiv.querySelector(".collapsible");
        let training = collapsible.querySelector(".training").querySelector(".collapsible-body");
        let questionDiv = training.querySelector(".musiqwik");
        let feedbackDiv = document.querySelector("." + this.clefData.containerDiv.id + "-feedback");
        
        feedbackDiv.innerHTML = "";

        let questionMusNotation;
        if(this.questionId === 0){
            questionMusNotation = musNotation.space;
        }else{
            questionMusNotation = findSingle(notes, this.questionId).musNotation;
        }

        questionDiv.innerHTML = 
            this.clefData.musNotation + 
            musNotation.space +
            questionMusNotation +
            musNotation.space +
            musNotation.barline;
    }

    displayLevelLimits(){
    
        let lowestNote = findSingle(notes, this.clefData.settingsAndStats.lowestNoteId);
        let highestNote = findSingle(notes, this.clefData.settingsAndStats.highestNoteId);

        let lowestNoteRange = document.getElementById(this.clefData.containerDiv.id + '-lowest-note-range');
        let highestNoteRange = document.getElementById(this.clefData.containerDiv.id + '-highest-note-range');

        let collapsible = this.clefData.containerDiv.querySelector(".collapsible");
        let settings = collapsible.querySelector(".settings").querySelector(".collapsible-body");
    }

    displayScore(){
        let scoreDiv = document.querySelector("." + this.clefData.containerDiv.id + "-score");
        let questionsNum = this.clefData.settingsAndStats.questionsNum.length;
        let rightAnswers = this.clefData.settingsAndStats.rightAnswers.length;

        scoreDiv.innerHTML = '<i class="fas fa-chart-bar"></i> ' + rightAnswers + " / " + questionsNum + " ( " + percentage(rightAnswers, questionsNum) + " %)";
    }

    //Event handlers
    handleNewQuestionButtonClick(event){
        event.currentTarget.classList.add("disabled");
        document.querySelectorAll("." + this.clefData.containerDiv.id + "-response-btn").forEach(function(item){
            item.classList.remove("disabled");
        });
        let feedbackDiv = document.querySelector("." + this.clefData.containerDiv.id + "-feedback");
        feedbackDiv.innerHTML= "&nbsp;";

        const lowestNoteId = parseInt(this.clefData.settingsAndStats.lowestNoteId);
        const highestNoteId = parseInt(this.clefData.settingsAndStats.highestNoteId);

        this.questionId = Math.floor(Math.random() * ((highestNoteId - lowestNoteId) + 1)) + lowestNoteId;

        let note = findSingle(this.clefData.notes, this.questionId);
        this.questionNoteNameId = note.noteNameId;

        this.clefData.settingsAndStats.questionsNum.push({
            noteId: this.questionId,
            levelId: parseInt(this.clefData.settingsAndStats.levelId)
        });

        this.displayQuestion();
        this.storeSettingsAndStats();
        this.displayScore();
    }

    handleResponseButtonClick(event){
        let newQuestionButton = document.querySelector("." + this.clefData.containerDiv.id + "-new-question-btn");
        newQuestionButton.classList.remove("disabled");
        document.querySelectorAll("." + this.clefData.containerDiv.id + "-response-btn").forEach(function(item){
            item.classList.add("disabled");
        });
        let feedbackDiv = document.querySelector("." + this.clefData.containerDiv.id + "-feedback");

        this.responseNoteNameId = event.currentTarget.dataset.noteid;
        
        if(parseInt(this.responseNoteNameId) === this.questionNoteNameId){
            feedbackDiv.style.color = "green";
            feedbackDiv.innerHTML = '<i class="far fa-grin"></i> Bonne réponse!';

            this.clefData.settingsAndStats.rightAnswers.push({
                noteId: this.questionId,
                levelId: parseInt(this.clefData.settingsAndStats.levelId)
            });

            this.storeSettingsAndStats();
            this.displayScore();
        }else{
            feedbackDiv.style.color = "red";
            feedbackDiv.innerHTML = '<i class="far fa-frown"></i> Erreur! La bonne réponse était: ' + findSingle(noteNames, this.questionNoteNameId).name;
        }
    }

    onLowestNoteChange(event){
        if(parseInt(event.currentTarget.value) >= parseInt(this.clefData.settingsAndStats.highestNoteId)) {
          event.currentTarget.value = this.clefData.settingsAndStats.lowestNoteId;
          M.toast({html: 'La note la plus grave ne peut pas être égale ou supérieure à la note la plus aigüe!', classes: 'toasts', displayLength: 2000});
        }
        else{
          this.clefData.settingsAndStats.lowestNoteId = event.currentTarget.value;
          this.storeSettingsAndStats();
        }

        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems, {});

        let newQuestionButton = document.querySelector("." + this.clefData.containerDiv.id + "-new-question-btn");
        newQuestionButton.classList.remove("disabled");
        document.querySelectorAll("." + this.clefData.containerDiv.id + "-response-btn").forEach(function(item){
            item.classList.add("disabled");
        });
        this.questionId = 0;
        this.displayQuestion();
    }

    onHighestNoteChange(event){
      console.log(event.currentTarget.value);
        if(parseInt(event.currentTarget.value) <= parseInt(this.clefData.settingsAndStats.lowestNoteId)) {
           event.currentTarget.value = this.clefData.settingsAndStats.highestNoteId;
          M.toast({html: 'La note la plus aigüe ne peut pas être égale ou inférieure à la note la plus grave!', classes: 'toasts', displayLength: 2000});
        }
        else{
          this.clefData.settingsAndStats.highestNoteId = event.currentTarget.value;
          this.storeSettingsAndStats();
        }

        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems, {});

        let newQuestionButton = document.querySelector("." + this.clefData.containerDiv.id + "-new-question-btn");
        newQuestionButton.classList.remove("disabled");
        document.querySelectorAll("." + this.clefData.containerDiv.id + "-response-btn").forEach(function(item){
            item.classList.add("disabled");
        });
        this.questionId = 0;
        this.displayQuestion();
    }
}