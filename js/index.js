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

  if(isStorageExist()){
    loadDataFromStorage()
  }
})

// Fungsi untuk menambahkan buku baru ke dalam array books
function addBook(){
  const bookTitle = capitalizeFirstLetter(document.getElementById(`inputBookTitle`).value);
  const authorName = capitalizeFirstLetter(document.getElementById(`inputBookAuthor`).value);
  const yearPublished = parseInt(document.getElementById(`inputBookYear`).value);
  const readStatus = document.getElementById(`inputBookIsComplete`).checked;

  const generateId = generateID();
  const bookObject = generateBookObject(generateId, bookTitle, authorName, yearPublished, readStatus);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Fungsi untuk menghasilkan ID unik berdasarkan timestamp.
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
 
// Fungsi untuk membuat elemen daftar buku yang belum selesai
function itemUncompleteBookshelfList(bookObject){
  const bookGroupUncompleted = document.createElement(`ul`);
  bookGroupUncompleted.classList.add(`list-group` ,`mb-2`);
  bookGroupUncompleted.innerHTML = `<li class="list-group-item active" aria-current="true" style="background-color: #3294cd;"><strong>${bookObject.title}</strong></li>
                                    <li class="list-group-item"><span class="fw-semibold">Penulis</span> : ${bookObject.author}</li>
                                    <li class="list-group-item"><span class="fw-semibold">Tahun</span> : ${bookObject.year}</li>
                                    <li class="list-group-item text-evenly">
                                      <button class="btn mx-1 border border-success btn-complete" style="background-color: #94cd32; --bs-border-opacity: .10;" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-check fa-lg btn-complete" style="color: #fff;" data-bookid="${bookObject.id}"></i></button>
                                      <button class="btn btn-primary mx-1 btn-edit" type="button" data-bookid="${bookObject.id}" data-bs-toggle="modal" data-bs-target="#editBook"><i class="fa-solid fa-pen-to-square btn-edit" data-bookid="${bookObject.id}"></i></button>
                                      <button class="btn btn-danger mx-1 btn-delete" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-trash-can btn-delete" data-bookid="${bookObject.id}"></i></button>
                                    </li>`

  return bookGroupUncompleted;                      
}

// Fungsi untuk membuat elemen daftar buku yang sudah selesai.
function itemCompleteBookshelfList(bookObject){
  const bookGroupCompleted = document.createElement(`ul`)
  bookGroupCompleted.classList.add(`list-group` ,`mb-2`);
  bookGroupCompleted.innerHTML = `<li class="list-group-item active" aria-current="true" style="background-color: #3294cd;"><strong>${bookObject.title}</strong></li>
                                  <li class="list-group-item"><span class="fw-semibold">Penulis</span> : ${bookObject.author}</li>
                                  <li class="list-group-item"><span class="fw-semibold">Tahun</span> : ${bookObject.year}</li>
                                  <li class="list-group-item text-evenly">
                                    <button class="btn mx-1 border border-success btn-undo" style="background-color: #ff8c00; --bs-border-opacity: .10;" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-rotate-right fa-flip-horizontal fa-lg btn-undo" style="color: #ffffff;" data-bookid="${bookObject.id}"></i></button>
                                    <button class="btn btn-primary mx-1 btn-edit" type="button" data-bookid="${bookObject.id}" data-bs-toggle="modal" data-bs-target="#editBook"><i class="fa-solid fa-pen-to-square btn-edit" data-bookid="${bookObject.id}"></i></button>
                                    <button class="btn btn-danger mx-1 btn-delete" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-trash-can btn-delete" data-bookid="${bookObject.id}"></i></button>
                                  </li>`

  return bookGroupCompleted;                                  
}

// Fungsi untuk mencari buku berdasarkan ID
function findBook(bookId){
  for (const bookTarget of books) {
    if (bookTarget.id == bookId) {
      return bookTarget;
    } 
  }
  return null;
}

// Fungsi untuk mencari indeks buku berdasarkan ID
function findBookIndex(bookId){
  for (const index in books) {
    if(books[index].id == bookId){
      return index;
    }
  }
  return -1;
}

// Fungsi untuk menandai buku sebagai sudah selesai
function addBookToComplete(bookId){
  const bookTarget = findBook(bookId);

  bookTarget.status = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Fungsi untuk mengembalikan status buku menjadi belum selesai
function undoBookToComplete(bookId){
  const bookTarget = findBook(bookId);

  bookTarget.status = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Fungsi untuk menghapus buku dari array books
function removeBook(bookId){
  const bookTarget = findBookIndex(bookId);

  if(bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(`click`, function(event){
  const target = event.target;

  if(target.classList.contains(`btn-complete`)){
    const bookid = target.dataset.bookid;
    addBookToComplete(bookid);
  }
  if(target.classList.contains(`btn-undo`)){
    const bookid = target.dataset.bookid;
    undoBookToComplete(bookid);
  }
  if(target.classList.contains(`btn-edit`)){
    const bookid = target.dataset.bookid;
    editDataBook(bookid);
  }
  if(target.classList.contains(`btn-delete`)){
    const bookid = target.dataset.bookid;
    removeBook(bookid);
  }
})

// Fungsi untuk mencari buku berdasarkan judul
function findTitle(bookTitle){
  console.log(bookTitle);
  for (const itemBook of books) {
    console.log(itemBook.title)
    if(itemBook.title == bookTitle){
      return itemBook;
    }
  }
  return null;
}

// Event listener untuk mencari buku berdasarkan judul
const btnSearch = document.getElementById(`btn-search`);
btnSearch.addEventListener(`click`, function(){
  const inputSearch = capitalizeFirstLetter(document.getElementById(`inputSearch`).value);
  const targetSearch = findTitle(inputSearch);
  console.log(inputSearch);
  console.log(targetSearch);

  if (targetSearch) {
    showSearchModal(targetSearch);
  } else {
    Swal.fire({
      title: 'Buku Tidak Ditemukan :(',
      icon: 'error',
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'OK',
      cancelButtonColor: '#d33'
    })
  }

  document.getElementById(`inputSearch`).value = ``;
})

function showSearchModal(book) {
  const searchModal = new bootstrap.Modal(document.getElementById('searchBook'));

  const statusColor = book.status ? 'text-success' : 'text-danger';

  const modalBody = document.querySelector('#searchBook .modal-body');
  modalBody.innerHTML = `
      <ul class="list-group list-group-flush">
          <li class="list-group-item"><span class="fw-semibold fs-4">${book.title}</span></li>
          <li class="list-group-item"><span class="fw-semibold">Penulis:</span> ${book.author}</li>
          <li class="list-group-item"><span class="fw-semibold">Tahun:</span> ${book.year}</li>
          <li class="list-group-item"><span class="fw-semibold ${statusColor}">Status:</span> ${book.status ? 'Selesai dibaca' : 'Belum selesai dibaca'}</li>
      </ul>
  `;
  searchModal.show();
}

// Fungsi untuk mengedit data buku.
function editDataBook(bookId){
  const bookTarget = findBook(bookId)
  
  const btnSubmitEdit = document.getElementById(`btn-submit`);
  btnSubmitEdit.addEventListener(`click`, function(){    
    const editTitle = capitalizeFirstLetter(document.getElementById(`inputEditBookTitle`).value);
    const editAuthor = capitalizeFirstLetter(document.getElementById(`inputEditBookAuthor`).value);
    const editYear = document.getElementById(`inputEditBookYear`).value;
  
    if(editTitle !== null && editAuthor !== null && editYear !== null){
      bookTarget.title = editTitle;
      bookTarget.author = editAuthor;
      bookTarget.year = editYear;
  
      saveData();
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
    })
}

// Fungsi untuk mengkapitalisasi huruf pertama 
function capitalizeFirstLetter(word){
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
}

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
