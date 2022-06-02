const READ_LIST_BOOK_ID = "done-reading";
const UNREAD_LIST_BOOK_ID = "undone-reading";
const BOOK_ITEM_ID = "bookId";

const isCompleted = document.getElementById("isCompleted");
const btnSubmitText = document.getElementById("submit__status");
const btnSubmit = document.getElementById("submit");
const submitForm = document.getElementById("add");
const btnReads = document.getElementById("btn-read");
const btnUnreads = document.getElementById("btn-unread");
const judulInput = document.getElementById("judul-input");
const penulisInput = document.getElementById("penulis-input");
const tahunInput = document.getElementById("tahun-input");
const newBookTitle = document.getElementById("new-book__title");
let bookEl;

document.addEventListener("DOMContentLoaded", function () {
  if (typeof Storage === undefined) {
    alert("Browser Anda tidak mendukung local storage.");
    return false;
  }

  buttonActivity();
  search();
  isChecked();
  loadDataFromStorage();
  refreshDataFromBooks();
});

function isChecked() {
  isCompleted.addEventListener("click", function () {
    if (newBookTitle.innerText === "TAMBAH BUKU") {
      btnSubmit.innerHTML = "Tambah ";
    } else {
      btnSubmit.innerHTML = "Update ";
    }

    if (isCompleted.checked) {
      btnSubmit.innerHTML +=
        'Buku Ke Rak <b id="submit__status">Sudah Selesai Dibaca</b>';
      btnSubmit.style.color = "#21ac56";
    } else {
      btnSubmit.innerHTML +=
        'Buku Ke Rak <b id="submit__status">Belum Selesai Dibaca</b>';
      btnSubmit.style.color = "#e66a44";
    }
  });
}

submitForm.addEventListener("submit", function (e) {
  e.preventDefault();

  isCompleted.checked ? addBook(true) : addBook(false);
});

function addBook(isCompleted) {
  if (bookEl) {
    const bookPosition = findBookIndex(bookEl[BOOK_ITEM_ID]);
    const btnCancel = document.getElementById("cancel");

    btnCancel.classList.add("hidden");
    newBookTitle.innerHTML = "TAMBAH BUKU";

    books.splice(bookPosition, 1);
    bookEl.remove();
    bookEl = "";
  }

  btnSubmit.innerHTML =
    'Tambah Buku Ke Rak <b id="submit__status">Belum Selesai Dibaca</b>';
  btnSubmit.style.color = "#e66a44";
  const isChecked = document.getElementById("isCompleted");
  isChecked.checked = false;

  const book = makeBookElement(
    judulInput.value,
    penulisInput.value,
    tahunInput.value,
    isCompleted
  );

  const bookObject = createBookObject(
    judulInput.value,
    penulisInput.value,
    tahunInput.value,
    isCompleted
  );

  book[BOOK_ITEM_ID] = bookObject.id;
  books.push(bookObject);

  if (isCompleted) {
    const listDoneReading = document.getElementById(READ_LIST_BOOK_ID);
    listDoneReading.append(book);
  } else {
    const listUndoneReading = document.getElementById(UNREAD_LIST_BOOK_ID);
    listUndoneReading.append(book);
  }

  refresh();
}

function makeBookElement(judulInput, penulisInput, tahunInput, isCompleted) {
  const bookContainer = document.createElement("div");

  if (isCompleted) {
    bookDetailHTML = makeBookDetailHTML("btn-unread", "Belum Dibaca");
  } else {
    bookDetailHTML = makeBookDetailHTML("btn-read", "Sudah Dibaca");
  }

  function makeBookDetailHTML(btn, text) {
    return `
      <div class="detail">
        <h3 id="judul">${judulInput}</span></h3>
        <p>Penulis: <span id="penulis">${penulisInput}</span></p>
        <p>Tahun: <span id="tahun">${tahunInput}</span></p>
      </div>
      <div class="action">
        <button id="${btn}">${text}</button>
        <button id="btn-edit"></button>
        <button id="btn-delete"></button>
      </div>
    `;
  }

  bookContainer.classList.add("book");
  bookContainer.innerHTML += bookDetailHTML;

  return bookContainer;
}

function buttonActivity() {
  document
    .querySelector(".book-section")
    .addEventListener("click", function (e) {
      const bookElement = e.target.parentElement.parentElement;

      switch (e.target.id) {
        case "btn-delete":
          deleteBook(bookElement);
          break;
        case "btn-read":
          swapBook(bookElement, true);
          break;
        case "btn-unread":
          swapBook(bookElement, false);
          break;
        case "btn-edit":
          setUpdateForm(bookElement);
          break;
      }
    });
}

function deleteBook(bookElement) {
  const bookTitle = bookElement.querySelector("#judul").innerText;

  Swal.fire({
    title: `Yakin ingin menghapus buku "${bookTitle}"?`,
    text: "Jika dihapus, data buku ini tidak bisa dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Iya, hapus!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Terhapus!", "Buku sudah berhasil dihapus", "success");

      const bookPosition = findBookIndex(bookElement[BOOK_ITEM_ID]);
      const btnCancel = document.getElementById("cancel");
      const isChecked = document.getElementById("isCompleted");
      btnSubmit.innerHTML =
        'Tambah Buku Ke Rak <b id="submit__status">Belum Selesai Dibaca</b>';
      btnSubmit.style.color = "#e66a44";
      isChecked.checked = false;
      btnCancel.classList.add("hidden");
      newBookTitle.innerHTML = "TAMBAH BUKU";
      bookEl = "";

      books.splice(bookPosition, 1);
      bookElement.remove();

      refresh();
    }
  });
}

function search() {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("keyup", function () {
    if (searchInput.value) {
      searchBook(searchInput.value);
    } else {
      refreshDataFromBooks();
    }
  });
}

function swapBook(bookElement, value) {
  const bookTitle = bookElement.querySelector("#judul").innerText;
  const bookAuthor = bookElement.querySelector("#penulis").innerText;
  const bookYear = bookElement.querySelector("#tahun").innerText;

  const newBook = makeBookElement(bookTitle, bookAuthor, bookYear, value);
  const book = findBook(bookElement[BOOK_ITEM_ID]);

  book.isCompleted = value;
  newBook[BOOK_ITEM_ID] = book.id;

  const listDoneReading = document.getElementById(READ_LIST_BOOK_ID);
  listDoneReading.append(newBook);

  bookElement.remove();

  refresh();
}

function setUpdateForm(bookElement) {
  const judul = bookElement.children[0].children[0].innerHTML;
  const penulis = bookElement.children[0].children[1].children[0].innerHTML;
  const tahun = bookElement.children[0].children[2].children[0].innerHTML;
  const status = bookElement.parentElement.id;
  const btnCancel = document.getElementById("cancel");

  window.scrollTo(0, 0);
  judulInput.focus();

  judulInput.value = judul;
  penulisInput.value = penulis;
  tahunInput.value = tahun;

  if (status === "done-reading") {
    isCompleted.checked = true;
    btnSubmit.innerHTML =
      'Update Buku Ke Rak <b id="submit__status">Sudah Selesai Dibaca</b>';
    btnSubmit.style.color = "#21ac56";
  } else {
    isCompleted.checked = false;
    btnSubmit.innerHTML =
      'Update Buku Ke Rak <b id="submit__status">Belum Selesai Dibaca</b>';
    btnSubmit.style.color = "#e66a44";
  }

  newBookTitle.innerHTML = "UPDATE BUKU";
  btnSubmit.className = "";
  btnCancel.classList.remove("hidden");
  bookEl = bookElement;

  btnCancel.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo(0, 0);
    newBookTitle.innerHTML = "TAMBAH BUKU";
    btnSubmit.innerHTML =
      'Tambah Buku Ke Rak <b id="submit__status">Belum Selesai Dibaca</b>';
    btnSubmit.style.color = "#e66a44";
    btnCancel.classList.add("hidden");
    isCompleted.checked = false;
    refresh();
  });
}

function refresh() {
  clearInput();
  updateDataToStorage();
  refreshDataFromBooks();
}

function clearInput() {
  document.getElementById("judul-input").value = "";
  document.getElementById("penulis-input").value = "";
  document.getElementById("tahun-input").value = "";
  document.getElementById("search-input").value = "";
}
