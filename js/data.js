const STORAGE_KEY = "BOOKSHELF";
let books = [];

function createBookObject(judul, penulis, tahun, isCompleted) {
	return {
		id: +new Date(),
		judul,
		penulis,
		tahun,
		isCompleted
	}
}

function saveData() {
	const parsed = JSON.stringify(books);
	localStorage.setItem(STORAGE_KEY, parsed);
}

function updateDataToStorage() {
	if (typeof(Storage) === undefined) {
		alert("BROWSER TIDAK MENDUKUNG LOCAL STORAGE!");
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
		const newBook = makeBookElement(book.judul, book.penulis, book.tahun ,book.isCompleted);
		newBook["ItemId"] = book.id;

		if (book.isCompleted) {
			listDoneRead.append(newBook);
		} else {
			listUndoneRead.append(newBook);
		}
	}
}