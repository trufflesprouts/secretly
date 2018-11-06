var save_btn = document.getElementById('save-notes');
var add_btn = document.getElementById('add-note');
var containerEL = document.getElementById('notes-list');

var State = {
  userId: data.userId,
  notes: Object.assign({}, data.notes)
}

renderDBNotes();

add_btn.addEventListener('click', function(e) {
  addNote();
});

save_btn.addEventListener('click', function(e) {
  saveToDB();
});

function renderDBNotes() {
  var keysArr = [];
  for (var key in State.notes) {
    keysArr.push(key);
  }
  keysArr.sort();

  for (var i = 0; i < keysArr.length; i++) {
    if (State.notes.hasOwnProperty(keysArr[i])) {
      createNoteEl(keysArr[i]);
    }
  }
}

function editable(element) {
  element.addEventListener('blur', function(e) {
    if (e.target.dataset.noteId != 'delete') {
      var newState = Object.assign({}, State);
      newState.notes[e.target.dataset.noteId] = e.target.textContent;
      State = newState;
    }
  });
}

function saveToDB() {
  save_btn.disabled = true;
  var xhr = new XMLHttpRequest();
  var url = '/notes'
  xhr.open('post', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      save_btn.disabled = false;
    }
  };
  xhr.send(JSON.stringify(State));
}

function addNote(element) {
  var noteId = Date.now();
  var newState = Object.assign({}, State);
  newState.notes[noteId] = '';
  State = newState;
  createNoteEl(noteId);
}

function deleteNote(element) {
  // if (confirm("Are you sure? this action can't be undone")) {
    var newState = Object.assign({}, State);
    delete newState.notes[element.dataset.noteId];
    element.dataset.noteId = 'delete';
    State = newState;
    element.classList.add('hidden');
    setTimeout(function () {
      element.outerHTML = "";
    }, 600);
  // }
}

function createNoteEl(noteId) {
  var singleNote = document.createElement("li");
  singleNote.className = "media hidden";
  singleNote.contentEditable = "true";
  singleNote.dataset.noteId = noteId;
  singleNote.textContent = State.notes[noteId];
  containerEL.insertBefore(singleNote, containerEL.childNodes[0]);
  setTimeout(function () {
    singleNote.classList.remove('hidden');
    singleNote.focus();
  }, 0);
  slideToDelete(singleNote);
  editable(singleNote);
}

function slideToDelete(element) {
  var hammertime = new Hammer(element, {cssProps: { userSelect: false }});
  hammertime.on('pan', function(ev) {
    element.classList.remove('is-animating');
    if (ev.center.x != 0 && (ev.deltaX > 150 || ev.deltaX < -150)) {
      element.classList.add('delete-stage-1');
    } else {
      element.classList.remove('delete-stage-1');
    }
    var scalePercentage = Math.abs(ev.deltaX) / 1500;
    element.style.transform = 'translateX( ' + ev.deltaX + 'px ) scale('+(1-scalePercentage)+')';
    if (ev.isFinal) {
      element.style.transform = 'translateX(0)';
      element.classList.add('is-animating');
      if (ev.center.x != 0 && (ev.deltaX > 150 || ev.deltaX < -150)) {
        deleteNote(element);
      }
      element.classList.remove('delete-stage-1');
    }
  });
}
