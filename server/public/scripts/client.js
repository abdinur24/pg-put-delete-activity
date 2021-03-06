
$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.delete', deleteBook);
  $('#bookShelf').on('click', '.update', updatingBookStatus);

  // TODO - Add code for edit & delete buttons
}

function deleteBook(event){
  const bookId = $(event.target).data('bookid');
  console.log('Deleting book with id of', bookId);

  $.ajax({
    method: 'DELETE',
    url: `/books/${bookId}`
  }).then(() => {
    refreshBooks();
  }).catch(error => {
    console.log('ERROR deleting book', error);
  })
}

// function updatingMarked(){
//   $.ajax({
//     method: 'GET',
//     url: '/books/isRead'
//   }).then(() => {
//     console.log(response)
//     $(response).addClass('marked')
//     // refreshBooks();
//   }).catch(error =>{
//     console.log('Error Marking book', error);
//   })

// }

function updatingBookStatus(event){
  const bookId = $(event.target).data('bookid');
  console.log( `Marking book with id of ${bookId} as read`);
  
  $.ajax({
    method: 'PUT',
    url: `/books/${bookId}/isRead`
  }).then(() => {
    // updatingMarked();
    refreshBooks();
  }).catch(error =>{
    console.log('Error Marking book', error);
  })
}



function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr class="mark" data-bookisread=${book.isRead}>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>
          <button class="update" data-bookid=${book.id}>Mark As Read</button>
        </td>
        <td>
          <button class="delete" data-bookid=${book.id}>Delete</button>
        </td>
      </tr>
    `);
  }
}

