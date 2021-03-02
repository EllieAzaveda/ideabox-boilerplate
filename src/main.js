// target variables
var titleInput = document.getElementById("titleInput");
var bodyInput = document.getElementById("bodyInput");
var inputFields = document.querySelectorAll(".user-input");
var saveButton = document.getElementById("saveButton");
var removeButton = document.getElementById("removeButton");
var favoriteButton = document.getElementById("favoriteButton");
var customCard = document.querySelector(".custom-card");
var showStarredButton = document.getElementById("showStarredButton");
var ideaGrid = document.querySelector(".idea-grid");
var searchInput = document.getElementById("searchInput");

// global variables
var savedCards = [];
var parsedCards = [];
var currentCard;

saveButton.disabled = true;

// event listeners

window.addEventListener("DOMContentLoaded", parseIdeas);

saveButton.addEventListener("click", function(event) {
  saveToArray(event);
});

showStarredButton.addEventListener("click", function(event) {
  toggleShowStarred();
});

for(const inputField of inputFields) {
inputField.addEventListener("input", function() {
  enableSaveButton();
})};

ideaGrid.addEventListener("click", function(event) {
  removeCard(event);
  addFavorite(event);
});

searchInput.addEventListener("input", filterSearch);

// functions

function saveToArray() {
  event.preventDefault();
  currentCard = new Idea(titleInput.value, bodyInput.value);
  currentCard.saveToStorage()
  updateCardDisplay();
  clearInput();
  disableSaveButton()
}

function removeCard(e) {
  if (e.target.classList.contains("remove-button")) {
    var cardId = parseInt(e.target.closest("div").id);
    for (var i = 0; i < savedCards.length; i++) {
      if (savedCards[i].id === cardId) {
        savedCards[i].deleteFromStorage(i);
      }
    }
  updateCardDisplay();
  }
}

function clearInput() {
  titleInput.value = "";
  bodyInput.value = "";
}

function enableSaveButton() {
  if (titleInput.value === "" && bodyInput.value === "") {
    saveButton.disabled = true;
    return;
  }
  if (bodyInput.value === "") {
    saveButton.disabled = true;
    return;
  }
  else {
    saveButton.disabled = false;
    saveButton.style.backgroundColor = "#363667";
    saveButton.style.cursor = "auto";
  }
}

function disableSaveButton() {
  saveButton.style.backgroundColor= "#E7E7FF";
  saveButton.disabled = true;
  saveButton.style.cursor = "not-allowed";
}

function addFavorite(e) {
  var storage = window.localStorage;
  var cardId = parseInt(e.target.closest("div").id)
  if (e.target.classList.contains("favorite-button")) {
    e.target.classList.toggle("filled-star");
    for (var i = 0; i < savedCards.length; i++) {
      if (savedCards[i].id === cardId && !savedCards[i].isStarred) {
        savedCards[i].isStarred = true;
      }
      else if (savedCards[i].id === cardId && savedCards[i].isStarred) {
        savedCards[i].isStarred = false;
      }
    }
  storage.clear();
  localStorage.setItem("ideas", JSON.stringify(savedCards));
  }
}

function updateCardDisplay() {
  customCard.classList.remove("hidden");
  renderHTML();
}

function parseIdeas() {
  if (localStorage.length > 0) {
    var retrievedArray = localStorage.getItem("ideas");
    parsedCards = JSON.parse(retrievedArray);
    instantiateStorage();
    renderHTML();
  }
}

function instantiateStorage() {
  for (var i = 0; i < parsedCards.length; i++) {
    currentCard = new Idea(parsedCards[i].title, parsedCards[i].body, parsedCards[i].isStarred, parsedCards[i].id, parsedCards[i].comments);
    currentCard.saveToStorage();
  }
  updateCardDisplay();
}

function toggleShowStarred() {
  if (showStarredButton.innerText === "Show All Ideas") {
    renderHTML();
    showStarredButton.innerText = "Show Starred Ideas";
  } else {
    showStarred();
  }
}

function renderHTML() {
  ideaGrid.innerHTML = "";
    for (var i = 0; i < savedCards.length; i++) {
      var status = assignStarValue(i);
      buildHTML(i, status);
    }
}

function assignStarValue(i) {
  var status;
  if (savedCards[i].isStarred) {
    status = "favorite-button filled-star";
  } else {
    status = "favorite-button";
  }
  return status;
}

function buildHTML(i, status) {
  ideaGrid.innerHTML += `
    <div class="custom-card" id="${savedCards[i].id}">
      <nav>
        <button class="${status}"></button>
        <button class="remove-button" id="removeButton"></button>
      </nav>
      <div class="card-body">
        <h2>${savedCards[i].title}</h2>
        <p>${savedCards[i].body} </p>
      </div>
      <footer>
        <button class="comment-button"></button>
        <label class="comment-label">Comment</label>
      </footer>
    </div>`
}

function showStarred() {
  var status;
  ideaGrid.innerHTML = "";
  for (var i = 0; i < savedCards.length; i++) {
    if (savedCards[i].isStarred) {
      status = "favorite-button filled-star";
      buildHTML(i, status);
    }
  }
  showStarredButton.innerText = "Show All Ideas";
}

  function filterSearch() {
  // var status;
  ideaGrid.innerHTML = "";
  for (var i = 0; i < savedCards.length; i++) {
    var status = assignStarValue(i);
    if (savedCards[i].title.toLowerCase().includes(searchInput.value.toLowerCase())
      || savedCards[i].body.toLowerCase().includes(searchInput.value.toLowerCase())) {
      buildHTML(i, status);
    }
    if (searchInput.value === "") {
      renderHTML();
    }
  }
}