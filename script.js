let books = JSON.parse(localStorage.getItem('libraryBooks')) || [];

function displayBooks(booksToDisplay = books) {
  const list = document.getElementById('books');
  list.innerHTML = '';

  if (booksToDisplay.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book-open"></i>
        <p>No books are available.</p>
      </div>
    `;
    updateBookCount();
    return;
  }

  booksToDisplay.forEach((book, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-author">by ${book.author}</div>
      </div>
      <button onclick="removeBook(${index})"><i class="fas fa-trash"></i> Remove</button>
    `;
    list.appendChild(li);
  });

  updateBookCount();
}

function addBook() {
  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  if (!title || !author) {
    showNotification('Please fill in both fields', 'error');
    return;
  }

  const newBook = { title, author };
  books.push(newBook);
  
  saveToLocalStorage();
  displayBooks();
  
  titleInput.value = '';
  authorInput.value = '';
  
  showNotification('Book added successfully!');
  titleInput.focus();
}

function removeBook(index) {
  const removedBook = books[index];
  books.splice(index, 1);
  
  saveToLocalStorage();
  displayBooks();
  
  showNotification(`"${removedBook.title}" removed from library`);
}

function searchBooks() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm) || 
    book.author.toLowerCase().includes(searchTerm)
  );
  displayBooks(filteredBooks);
}

function saveToLocalStorage() {
  localStorage.setItem('libraryBooks', JSON.stringify(books));
}

function updateBookCount() {
  const countElement = document.getElementById('book-count');
  const bookCount = books.length;
  countElement.textContent = `(${bookCount} ${bookCount === 1 ? 'book' : 'books'})`;
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = 'notification show';
  
  if (type === 'error') {
    notification.style.background = 'var(--danger-color)';
  } else {
    notification.style.background = 'var(--success-color)';
  }
  
  setTimeout(() => {
    notification.className = 'notification';
  }, 3000);
}

// Handle Enter key press
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('title').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addBook();
    }
  });
  
  document.getElementById('author').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addBook();
    }
  });
  
  displayBooks();
});