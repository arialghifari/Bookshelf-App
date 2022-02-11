const STORAGE_KEY = "BOOKSHELF";
let books = [];

function createBookObject(title, author, year, isCompleted) {
	return {
		id: +new Date(),
		title,
		author,
		year,
		isCompleted
	}
}

function saveData() {
	const parsed = JSON.stringify(books);
	localStorage.setItem(STORAGE_KEY, parsed);
}

function updateDataToStorage() {
	if (typeof(Storage) === undefined) {
		alert("Browser Anda tidak mendukung local storage.");
		return false;
	}
	
	saveData();
}

function loadDataFromStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		books = data;
	}
}

function refreshDataFromBooks() {
	let listUndoneRead = document.getElementById("undone-reading");
	let listDoneRead = document.getElementById("done-reading");
	
	for (book of books) {
		const newBook = makeBookElement(book.title, book.author, book.year, book.isCompleted);
		newBook[BOOK_ITEM_ID] = book.id;

		if (book.isCompleted) {
			listDoneRead.append(newBook);
		} else {
			listUndoneRead.append(newBook);
		}
	}
}

function findBookIndex(bookId) {
	let index = 0;
	for (book of books) {
		if (book.id === bookId) {
			return index;
		}

		index++;
	}

	return -1;
}

function findBook(bookId) {
	for (book of books) {
		if (book.id === bookId) {
			return book;
		}
	}

	return null;
}