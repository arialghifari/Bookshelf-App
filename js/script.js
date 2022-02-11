const READ_LIST_BOOK_ID = "done-reading";
const UNREAD_LIST_BOOK_ID = "undone-reading";
const BOOK_ITEM_ID = "bookId";

const isCompleted = document.getElementById("isCompleted");
const btnSubmitText = document.getElementById("submit__status");
const btnSubmit = document.getElementById("submit");
const submitForm = document.getElementById("add");
const btnReads = document.querySelectorAll("#btn-read");
const btnUnreads = document.querySelectorAll("#btn-unread");
const header = document.getElementsByTagName("header")[0];

document.addEventListener("DOMContentLoaded", function () {
	header.addEventListener("click", function() {
		location.reload(true);
	});

	if (typeof (Storage) === undefined) {
		alert("Browser Anda tidak mendukung local storage.");
		return false;
	}

	buttonActivity();
	loadDataFromStorage();
	refreshDataFromBooks();
});

isCompleted.addEventListener("click", function () {
	if (isCompleted.checked) {
		btnSubmitText.innerText = "Sudah Selesai Dibaca";
		btnSubmit.style.backgroundColor = "#21ac56";
	} else {
		btnSubmitText.innerText = "Belum Selesai Dibaca";
		btnSubmit.style.backgroundColor = "#cf4a39";
	}
});

submitForm.addEventListener("submit", function (e) {
	e.preventDefault();

	if (isCompleted.checked) {
		addBook(true);
	} else {
		addBook(false);
	}
});

function addBook(isCompleted) {
	const judulInput = document.getElementById("judul-input").value;
	const penulisInput = document.getElementById("penulis-input").value;
	const tahunInput = document.getElementById("tahun-input").value;

	const book = makeBookElement(judulInput, penulisInput, tahunInput, isCompleted);
	const bookObject = createBookObject(judulInput, penulisInput, tahunInput, isCompleted);

	book[BOOK_ITEM_ID] = bookObject.id;
	books.push(bookObject);

	if (isCompleted) {
		const listDoneReading = document.getElementById(READ_LIST_BOOK_ID);
		listDoneReading.append(book);
	} else {
		const listUndoneReading = document.getElementById(UNREAD_LIST_BOOK_ID);
		listUndoneReading.append(book);
	}

	updateDataToStorage();
}

function makeBookElement(judulInput, penulisInput, tahunInput, isCompleted) {
	const bookContainer = document.createElement("div");

	if (isCompleted) {
		bookDetailHTML = `
			<div class="detail">
				<h3 id="judul">${judulInput}</span></h3>
				<p>Penulis: <span id="penulis">${penulisInput}</span></p>
				<p>Tahun: <span id="tahun">${tahunInput}</span></p>
			</div>
			<div class="action">
				<button id="btn-unread">Belum Dibaca</button>
				<button id="btn-delete">Hapus</button>
			</div>
		`;
	} else {
		bookDetailHTML = `
			<div class="detail">
				<h3 id="judul">${judulInput}</h3>
				<p>Penulis: <span id="penulis">${penulisInput}</span></p>
				<p>Tahun: <span id="tahun">${tahunInput}</span></p>
			</div>
			<div class="action">
				<button id="btn-read">Selesai Dibaca</button>
				<button id="btn-delete">Hapus</button>
			</div>
		`;
	}

	bookContainer.classList.add("book");
	bookContainer.innerHTML += bookDetailHTML;

	return bookContainer;
}

function buttonActivity() {
	document.addEventListener("click", function(e) {
		const btnDeleteClicked = e.target.id == "btn-delete";
		const btnReadClicked = e.target.id == "btn-read";
		const btnUnreadClicked = e.target.id == "btn-unread";

		if (btnDeleteClicked) {
			const bookTitle = e.target.parentElement.parentElement.querySelector("#judul").innerText;

			confirmDelete = confirm(`Yakin ingin menghapus buku "${bookTitle}"?`);
			
			if (confirmDelete) {
				const bookElement = e.target.parentElement.parentElement;
				const bookPosition = findBookIndex(bookElement[BOOK_ITEM_ID]);
	
				books.splice(bookPosition, 1);
				bookElement.remove();
	
				updateDataToStorage();
			}
		} else if (btnReadClicked) {
			const bookElement = e.target.parentElement.parentElement;
			const bookTitle = e.target.parentElement.parentElement.querySelector("#judul").innerText;
			const bookAuthor = e.target.parentElement.parentElement.querySelector("#penulis").innerText;
			const bookYear = e.target.parentElement.parentElement.querySelector("#tahun").innerText;

			const newBook = makeBookElement(bookTitle, bookAuthor, bookYear, true);
			const book = findBook(bookElement[BOOK_ITEM_ID]);
			
			book.isCompleted = true;
			newBook[BOOK_ITEM_ID] = book.id;

			const listDoneReading = document.getElementById(READ_LIST_BOOK_ID);
			listDoneReading.append(newBook);

			bookElement.remove();

			updateDataToStorage();
		} else if (btnUnreadClicked) {
			const bookElement = e.target.parentElement.parentElement;
			const bookTitle = e.target.parentElement.parentElement.querySelector("#judul").innerText;
			const bookAuthor = e.target.parentElement.parentElement.querySelector("#penulis").innerText;
			const bookYear = e.target.parentElement.parentElement.querySelector("#tahun").innerText;

			const newBook = makeBookElement(bookTitle, bookAuthor, bookYear, false);
			const book = findBook(bookElement[BOOK_ITEM_ID]);
			
			book.isCompleted = false;
			newBook[BOOK_ITEM_ID] = book.id;

			const listUndoneReading = document.getElementById(UNREAD_LIST_BOOK_ID);
			listUndoneReading.append(newBook);

			bookElement.remove();

			updateDataToStorage();
		}

	});
}