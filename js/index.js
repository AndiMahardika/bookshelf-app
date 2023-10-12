const books = [];
const RENDER_EVENT = `render_book`;
const STORAGE_KEY = `BOOKSHELF_APPS`;
const SAVED_DATA = `SAVED_DATA`;

document.addEventListener(`DOMContentLoaded`, function(){  
  const submitBook = document.getElementById(`inputBook`);

  submitBook.addEventListener(`submit`,function(event){
    event.preventDefault()
    addBook();
  })

  if(isStorageExist){
    loadDataFromStorage()
  }
})

function addBook(){
  const bookTitle = document.getElementById(`inputBookTitle`).value;
  const authorName = document.getElementById(`inputBookAuthor`).value;
  const yearPublished = document.getElementById(`inputBookYear`).value;
  const readStatus = document.getElementById(`inputBookIsComplete`).checked;

  const generateId = generateID();
  const bookObject = generateBookObject(generateId, bookTitle, authorName, yearPublished, readStatus);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateID(){
  return +new Date()
}

function generateBookObject(id, title, author, year, status){
  return {
    id,
    title,
    author,
    year,
    status
  }
}
 
function itemUncompleteBookshelfList(bookObject){
  const bookGroupUncompleted = document.createElement(`ul`);
  bookGroupUncompleted.classList.add(`list-group` ,`mb-2`);
  bookGroupUncompleted.innerHTML = `<li class="list-group-item active" aria-current="true" style="background-color: #3294cd;"><strong>${bookObject.title}</strong></li>
                                    <li class="list-group-item"><span class="fw-semibold">Penulis</span> : ${bookObject.author}</li>
                                    <li class="list-group-item"><span class="fw-semibold">Tahun</span> : ${bookObject.year}</li>
                                    <li class="list-group-item text-evenly">
                                      <button class="btn mx-1 border border-success btn-complete" style="background-color: #94cd32; --bs-border-opacity: .10;" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-check fa-lg btn-complete" style="color: #fff;" data-bookid="${bookObject.id}"></i></button>
                                      <button class="btn btn-primary mx-1 btn-edit" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-pen-to-square btn-edit" data-bookid="${bookObject.id}"></i></button>
                                      <button class="btn btn-danger mx-1" type="button"><i class="fa-solid fa-trash-can btn-delete" data-bookid="${bookObject.id}"></i></button>
                                    </li>`

  return bookGroupUncompleted;                      
}

function itemCompleteBookshelfList(bookObject){
  const bookGroupCompleted = document.createElement(`ul`)
  bookGroupCompleted.classList.add(`list-group` ,`mb-2`);
  bookGroupCompleted.innerHTML = `<li class="list-group-item active" aria-current="true" style="background-color: #3294cd;"><strong>${bookObject.title}</strong></li>
                                  <li class="list-group-item"><span class="fw-semibold">Penulis</span> : ${bookObject.author}</li>
                                  <li class="list-group-item"><span class="fw-semibold">Tahun</span> : ${bookObject.year}</li>
                                  <li class="list-group-item text-evenly">
                                    <button class="btn mx-1 border border-success btn-undo" style="background-color: #ff8c00; --bs-border-opacity: .10;" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-rotate-right fa-flip-horizontal fa-lg btn-undo" style="color: #ffffff;" data-bookid="${bookObject.id}"></i></button>
                                    <button class="btn btn-primary mx-1 btn-edit" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-pen-to-square btn-edit" data-bookid="${bookObject.id}"></i></button>
                                    <button class="btn btn-danger mx-1 btn-delete" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-trash-can btn-delete" data-bookid="${bookObject.id}"></i></button>
                                  </li>`

  return bookGroupCompleted;                                  
}

function findBook(bookId){
  for (const bookTarget of books) {
    if (bookTarget.id == bookId) {
      return bookTarget;
    } 
  }
  return null;
}

function findBookIndex(bookId){
  for (const index in books) {
    if(books[index].id == bookId){
      return index;
    }
  }
  return -1;
}

function addBookToComplete(bookId){
  const bookTarget = findBook(bookId);

  bookTarget.status = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookToComplete(bookId){
  const bookTarget = findBook(bookId);

  bookTarget.status = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId){
  const bookTarget = findBookIndex(bookId);

  if(bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}



document.addEventListener(`click`, function(event){
  if(event.target.classList.contains(`btn-complete`)){
    const bookid = event.target.dataset.bookid;
    addBookToComplete(bookid);
    console.log(bookid);
  }
  if(event.target.classList.contains(`btn-undo`)){
    const bookid = event.target.dataset.bookid;
    undoBookToComplete(bookid);
  }
  if(event.target.classList.contains(`btn-edit`)){
    const bookid = event.target.dataset.bookid;
    console.log(bookid);
  }
  if(event.target.classList.contains(`btn-delete`)){
    const bookid = event.target.dataset.bookid;
    removeBook(bookid);
  }
})

// RENDER_EVENT
document.addEventListener(RENDER_EVENT, function(){
  const uncompletedBOOKList = document.getElementById(`incompleteBookshelfList`);
  uncompletedBOOKList.innerHTML = ``;

  const completedBOOKList = document.getElementById(`completeBookshelfList`);
  completedBOOKList.innerHTML = ``;

  for (const bookItem of books) {
    if(!bookItem.status){
      uncompletedBOOKList.appendChild((itemUncompleteBookshelfList(bookItem)));
    } else {
      completedBOOKList.appendChild((itemCompleteBookshelfList(bookItem)));
    }
  }
})

// Storage
function isStorageExist(){
  if(typeof(Storage) == undefined){
    alert(`Browser tidak mendukung local storage`);
    return false;
  }
  return true;
}

function saveData(){
  if(isStorageExist()){
    const data = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, data);
    document.dispatchEvent(new Event(SAVED_DATA));
  }
}

document.addEventListener(SAVED_DATA, function(){
  console.log(localStorage.getItem(STORAGE_KEY));
})

function loadDataFromStorage(){
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if(data != null){
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}