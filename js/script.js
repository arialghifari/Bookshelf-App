const isCompleted = document.getElementById("isCompleted");
const btnSubmitText = document.getElementById("submit__status");
const btnSubmit = document.getElementById("submit");

const submitForm = document.getElementById("add");

document.addEventListener("DOMContentLoaded", function () {
	if (typeof(Storage) === undefined) {
		alert("BROWSER TIDAK MENDUKUNG LOCAL STORAGE!");
		return false;
	}
	
	loadDataFromStorage();
	refreshDataFromBooks();
});

isCompleted.addEventListener("click", function() {
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
	const judulInput = document.getElementById("judul").value;
	const penulisInput = document.getElementById("penulis").value;
	const tahunInput = document.getElementById("tahun").value;

	const book = makeBookElement(judulInput, penulisInput, tahunInput, isCompleted);
	const bookObject = createBookObject(judulInput, penulisInput, tahunInput, isCompleted);

	book["itemId"] = bookObject.id;
	books.push(bookObject);

	if (isCompleted) {
		const doneReading = document.getElementById("done-reading");
		doneReading.append(book);
	} else {
		const undoneReading = document.getElementById("undone-reading");
		undoneReading.append(book);
	}

	updateDataToStorage();
}

function makeBookElement(judulInput, penulisInput, tahunInput, isCompleted) {
	const bookContainer = document.createElement("div");

	if (isCompleted) {
		bookDetailHTML = `
			<div class="detail">
				<h3>${judulInput}</h3>
				<p>Penulis: ${penulisInput}</p>
				<p>Tahun: ${tahunInput}</p>
			</div>
			<div class="action">
				<button>Belum Dibaca</button>
				<button>Hapus</button>
			</div>
		`;
	} else {
		bookDetailHTML = `
			<div class="detail">
				<h3>${judulInput}</h3>
				<p>Penulis: ${penulisInput}</p>
				<p>Tahun: ${tahunInput}</p>
			</div>
			<div class="action">
				<button>Selesai Dibaca</button>
				<button>Hapus</button>
			</div>
		`;
	}
	
	bookContainer.classList.add("book");
	bookContainer.innerHTML += bookDetailHTML;

	return bookContainer;
}