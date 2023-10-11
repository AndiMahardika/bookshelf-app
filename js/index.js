const books = [];
const RENDER_EVENT = `render_book`;

document.addEventListener(`DOMContentLoaded`,function(){
  const inputBook = document.getElementById(`inputBook`);

  inputBook.addEventListener(`submit`, function(event){
    event.preventDefault();
    addBook();
  });
});

function addBook(){
  const bookTitle = document.getElementById(`inputBookTitle`).value;
  const authorName = document.getElementById(`inputBookAuthor`).value;
  const yearPublished = document.getElementById(`inputBookYear`).value;
  const readStatus = document.getElementById(`inputBookIsComplete`).checked;

  const generateId = generateID();
  const bookObject = generateBookObject(generateId, bookTitle, authorName, yearPublished, readStatus);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
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

// RENDER_EVENT
document.addEventListener(RENDER_EVENT, function(){
  for (const item of books) {
    console.log(item);
  }
})