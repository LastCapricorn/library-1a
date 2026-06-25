"use strict";

const library1a = ( () => {

  const exmpLibData = [
    [ "The Talisman", "Peter Straub, Stephen King", "Fantasy", 1984, 784, true, 5 ],
    [ "The Dark Tower", "Stephen King", "Fantasy", 2012, 4720, true, 5 ],
    [ "The Lord Of The Rings", "J.R.R. Tolkien", "Fantasy", 1955, 1178, true, 5 ],
    [ "The Hobbit", "J.R.R. Tolkien", "Children's Fantasy", 1937, 320, true, 5 ],
    [ "Harry Potter And The Deathly Hallows", "Joanne K. Rowling", "Fantasy", 2007, 767, false, 0 ],
    [ "The Man Who Planted Trees", "Jean Giono", "Allegory", 1953, 71, true, 5],
    [ "The Hundred-Year-Old Man Who Climbed Out The Window And Disappeared", "Jonas Jonasson", "Comic Novel", 2009, 413, true, 5 ],
    [ "The Stone And The Flute", "Hans Bemmann", "Fairy tale", 1983, 935, true, 5 ],
    [ "Animal Farm: A Fairy Story", "George Orwell", "Fable", 1945, 141, true, 5 ],
    [ "Nineteen Eighty-Four", "George Orwell", "Dystopia", 1949, 382, true, 5 ],
    [ "Brave New World", "Aldous Huxley", "Dystopia", 1932, 310, true, 5 ],
  ];

  const library = [];

  function Bookshelf(name) {
    if (!new.target) throw Error("The 'new' operator is required for using the constructor function.");
    if (arguments[0] === "" || arguments[0] === undefined)
      throw Error("The bookshelf needs a name.");
    this.name = name;
    this[name] = [];
  }

  function Book(title, author = "", category = "", year = 2026, pages = 0, read = false, rating = 0, uuid = "") {
    if (!new.target) throw Error("The 'new' operator is required for using the constructor function.");
    if (arguments[0] === "" || arguments[0] === undefined)
      throw Error("The Book needs at least a title.");
    this.title = title;
    this.author = author;
    this.category = category;
    this.year = year;
    this.pages = pages;
    this.read = read;
    this.rating = rating;
    this.uuid = uuid;
  }
  Book.prototype.generateUuid = function() {
    this.uuid = this.uuid === "" ? crypto.randomUUID() : this.uuid;
  }
  Book.prototype.createBookcard = function() {
    const template = document.querySelector("#book-card-template");
    const card = document.importNode(template.content, true);

    card.querySelector(".book-card").dataset.uuid = this.uuid;
    card.querySelector(".book-card").addEventListener("change", handleChangeEvent);

    card.querySelector(".book-title").textContent = this.title;
    card.querySelector(".book-author").textContent = this.author;
    card.querySelector(".book-category").textContent = this.category;
    card.querySelector(".book-year").textContent = this.year;
    card.querySelector(".book-pages").textContent = this.pages;

    card.querySelector(".label-read").setAttribute("for", `${this.uuid}-read`);
    card.querySelector(".label-read").textContent = this.read ? "already read" : "not read yet";

    card.querySelector(".book-read").setAttribute("id", `${this.uuid}-read`);
    if (this.read) card.querySelector(".book-read").setAttribute("checked", "");

    let count = 1;
    card.querySelectorAll(".book-rating label").forEach( rateLabel => {
      rateLabel.setAttribute("for", `${this.uuid}-${count++}`);
    });

    count = 1;
    card.querySelectorAll(".book-rating input").forEach ( rateInput => {
      if (this.rating >= count) rateInput.setAttribute("checked", "");
      rateInput.setAttribute("id", `${this.uuid}-${count++}`);
    });

    card.querySelector(".button-trash").dataset.uuid = this.uuid;
    card.querySelector(".button-trash").addEventListener("click", removeBook);

    container.prepend(card);
  }

  const container = document.querySelector(".container");
  const selectBookshelf = document.querySelector("#shelf-select");
  const bookshelfDialog = document.querySelector("#bookshelf_dialog");
  const bookshelfForm = document.querySelector("#bookshelf_form");
  const inputBookshelfName = document.querySelector("#bookshelf_name");
  const buttonRemoveBookshelf = document.querySelector(".remove-bookshelf");

  const bookDialog = document.querySelector("#book_dialog");
  const bookForm = document.querySelector("#book_form");
  const bookFormData = bookForm.querySelectorAll("input:not(.star input)");
  const bookFormRating = bookForm.querySelectorAll(".star input");
  const bookFormStars = document.querySelectorAll(".star input");
  let rating = 0;

  const preferredScheme = () => getComputedStyle(document.documentElement).getPropertyValue("color-scheme");
  const getStoredLibrary = () =>JSON.parse(localStorage.getItem("lib1a_library"));
  const getStoredIndex = () => localStorage.getItem("lib1a_stored-index");
  const storeIndex = number => localStorage.setItem("lib1a_stored-index", number);
  const getBookshelfIndex = value => library.findIndex( shelf => shelf.name === value);
  const storeLibrary = () => localStorage.setItem("lib1a_library", JSON.stringify(library));
  const currentBookshelf = () => library[getStoredIndex()][library[getStoredIndex()].name];

  function initLibrary() {
    if(!getStoredLibrary().length) {
      const exampleBookshelf = new Bookshelf("example");
      library.push(exampleBookshelf);
      storeIndex(0);
      exmpLibData.forEach( book => {
        const newBook = createBook(book);
        currentBookshelf().push(newBook);
        newBook.createBookcard();
      });
      storeLibrary();
    } else {
      library.push(...getStoredLibrary());
      displayBookshelf();
    }
    library.forEach( shelf => addBookshelfOption(shelf.name, getBookshelfIndex(shelf.name) === Number(getStoredIndex()) ? true : false));
  }

  function createBook(data) {
    try {
      const newBook = new Book(...data);
      newBook.generateUuid();
      return newBook;
    } catch (error) {
      console.error(error);
    }
  }

  function addBookshelfOption(name, selected="true") {
    const newOption = document.createElement("option");
    newOption.setAttribute("value", name);
    if(selected) newOption.setAttribute("selected", "");
    newOption.textContent  = name;
    selectBookshelf.appendChild(newOption);
  }

  function handleChangeEvent(ev) {
    ev.preventDefault();
    if (ev.target.id.endsWith("-read")) {
      const readIndex = currentBookshelf().findIndex( book => ev.target.id.startsWith(book.uuid));
      currentBookshelf()[readIndex].read = !currentBookshelf()[readIndex].read;
      storeLibrary();
    } else {
      setBookRating(ev);
    }
  }

  function removeBook(ev) {
    const removeIndex = currentBookshelf().findIndex( book => book.uuid === ev.target.closest("button").dataset.uuid);
    document.querySelector(`[data-uuid="${ev.target.closest('button').dataset.uuid}"]`).remove();
    currentBookshelf().splice(removeIndex, 1);
    storeLibrary();
  }

  function setBookRating(ev) {
    const rateIndex = currentBookshelf().findIndex( book => ev.target.id.startsWith(book.uuid));
    if (ev.target.checked) {
      currentBookshelf()[rateIndex].rating = Number(ev.target.value);
    } else {
      currentBookshelf()[rateIndex].rating =
        currentBookshelf()[rateIndex].rating > Number(ev.target.value) ?
        Number(ev.target.value) : --currentBookshelf()[rateIndex].rating;
    }
    storeLibrary();
    setCardStars(currentBookshelf()[rateIndex]);
  }

  function setCardStars(book) {
    const currentCard = document.querySelector(`.book-card[data-uuid="${book.uuid}"]`);
    const allStars = currentCard.querySelectorAll(`.book-rating input`);
    allStars.forEach( star => {
      if(star.value <= book.rating) {
        star.checked = true;
      } else {
        star.checked = false;
      }
    });
  }

  function createNewBook(ev) {
    ev.preventDefault();
    const newBookData = [...bookFormData].map(
      date => date.getAttribute("type") === "checkbox" ? date.checked : date.value);
    const newBookRating = [...bookFormRating].reduce(
      (sum, star) => star.checked ? ++sum : sum, 0);
    newBookData.push(newBookRating);
    const newBook = createBook(newBookData);
    currentBookshelf().push(newBook);
    newBook.createBookcard();
    resetBookForm();
    storeLibrary();
  }

  function resetBookForm() {
    bookForm.reset();
    bookDialog.close();
  }

  function setFormRating(ev) {
    if (ev.target.checked) {
      rating = Number(ev.target.value);
    } else {
      rating = rating > Number(ev.target.value) ?
        Number(ev.target.value) : --rating;
    }
    setFormStars();
  }

  function setFormStars() {
    bookFormStars.forEach( star => {
      if(star.value <= rating) {
        star.checked = true;
      } else {
        star.checked = false;
      }
      });
  }

  function createBookshelf(ev) {
    ev.preventDefault();
    if (!inputBookshelfName.value) return;
    try {
      const newBookshelf = new Bookshelf(inputBookshelfName.value);
      library.push(newBookshelf);
      storeLibrary();
      storeIndex(library.length - 1);
      addBookshelfOption(inputBookshelfName.value);
      changeBookshelf();
      resetBookshelfForm();
      buttonRemoveBookshelf.removeAttribute("disabled");
    } catch (error) {
      console.error(error);
    }
  }

  function changeBookshelf() {
    container.querySelectorAll("div").forEach( div => div.remove());
    storeIndex(getBookshelfIndex(selectBookshelf.value));
    displayBookshelf();
  }

  function resetBookshelfForm() {
    bookshelfForm.reset();
    bookshelfDialog.close();
  }

  function displayBookshelf() {
    currentBookshelf().forEach( book => {
      const bookArr = []
      for( const key in book) {
        bookArr.push(book[key]);
      }
      book = createBook(bookArr);
      book.createBookcard();
    });
  }

  function removeBookshelf() {
    selectBookshelf.querySelector(`[value=${library[getStoredIndex()].name}]`).remove();
    library.splice(getStoredIndex(), 1);
    storeIndex(0);
    storeLibrary();
    if (library.length > 0) {
      selectBookshelf.querySelector(`[value=${library[getStoredIndex()].name}]`).selected = true;
      changeBookshelf();
    } else {
      container.querySelectorAll("div").forEach( div => div.remove());
      buttonRemoveBookshelf.setAttribute("disabled", "");
    }
    document.querySelector("#remove_dialog").close();
  }

  buttonRemoveBookshelf.addEventListener("click", () => document.querySelector("#remove_dialog").show());
  document.querySelector(".confirm-removal").addEventListener("click", removeBookshelf);

  bookForm.addEventListener("submit", createNewBook);

  selectBookshelf.addEventListener("change", changeBookshelf);

  bookshelfForm.addEventListener("submit", createBookshelf);

  inputBookshelfName.addEventListener("input", () => {
    if(library.every( shelf => shelf.name !== inputBookshelfName.value)) {
      inputBookshelfName.setCustomValidity("");
    } else {
      inputBookshelfName.setCustomValidity("A bookshelf with this name already exists!");
    }
  });

  bookFormStars.forEach( star => star.addEventListener("change", setFormRating));

  document.querySelector("#info_pop button").addEventListener("click", () => {
    localStorage.clear();
    while(library.length) library.pop();
  });

  document.querySelector(".scheme-toggle").addEventListener("click", () => {
    document.documentElement.style.setProperty("color-scheme",
      preferredScheme() === "light" ? "dark" : "light");
    localStorage.setItem("lib1a_selected-theme", preferredScheme() );
  });
  document.documentElement.style.setProperty("color-scheme",
    `${ localStorage.getItem("lib1a_selected-theme") || preferredScheme() }`
  );

  initLibrary();

})();
