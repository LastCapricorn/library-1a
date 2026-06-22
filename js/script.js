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

  Book.prototype.bookcard = {};

  Book.prototype.generateUuid = function() {
    this.uuid = crypto.randomUUID();
  }

  Book.prototype.setBookcard = function() {
    this.bookcard = createBookcard(this);
  }

  Book.prototype.getBookcard = function() {
    return this.bookcard;
  };

  const preferredScheme = () => getComputedStyle(document.documentElement).getPropertyValue("color-scheme");
  const getStoredIndex = () => localStorage.getItem("lib1a_stored-index");
  const storeIndex = number => localStorage.setItem("lib1a_stored-index", number);
  const getIndex = value => library.findIndex( shelf => shelf.name === value);
  const storeLibrary = () => localStorage.setItem("lib1a_library", JSON.stringify(library));
  const getStoredLibrary = () =>JSON.parse(localStorage.getItem("lib1a_library"));
  const currentBookshelf = () => library[getStoredIndex()][library[getStoredIndex()].name];
  const container = document.querySelector(".container");
  const selectBookshelf = document.querySelector("#shelf-select");
  const bookshelfDialog = document.querySelector("#bookshelf_dialog");
  const bookshelfForm = document.querySelector("#bookshelf_form");
  const inputBookshelfName = document.querySelector("#bookshelf_name");
  const bookDialog = document.querySelector("#book_dialog");
  const bookForm = document.querySelector("#book_form");
  const stars = document.querySelectorAll(".star input");
  let rating = 0;

  function displayBookcard(book) {
    container.prepend(book.getBookcard());
  }

  function createBookcard(book) {
    const template = document.querySelector("#book-card-template");
    const cloneCard = document.importNode(template.content, true);
    cloneCard.querySelector(".book-card").setAttribute("id", book.uuid);
    cloneCard.querySelector(".book-title").textContent = book.title;
    cloneCard.querySelector(".book-author").textContent = book.author;
    cloneCard.querySelector(".book-category").textContent = book.category;
    cloneCard.querySelector(".book-year").textContent = book.year;
    cloneCard.querySelector(".book-pages").textContent = book.pages;
    cloneCard.querySelector(".book-read").textContent = book.read ? "already read" : "not read yet";
    cloneCard.querySelector(".book-rating").dataset.rate = book.rating;
    return cloneCard;
  }

  function createBook(ev) {
    ev.preventDefault();
    try {
      const newBookData = [...document.querySelectorAll("#book_form > input")]
        .map( date => date.getAttribute("type") === "checkbox" ? date.checked : date.value);
      const newBookRating = [...bookForm.querySelectorAll("div input")].reduce( (sum, star) => star.checked ? ++sum : sum, 0);
      newBookData.push(newBookRating);
      const newBook = new Book(...newBookData);
      newBook.generateUuid();
      newBook.setBookcard();
      currentBookshelf().push(newBook);
      storeLibrary();
      bookForm.reset();
      bookDialog.close();
      displayBookcard(newBook);
    } catch (error) {
      console.error(error);
    }
  }

  function changeBookshelf() {
    container.querySelectorAll("div").forEach( div => div.remove());
    storeIndex(getIndex(selectBookshelf.value));
    initBookshelf();
  }

  function addBookshelfOption(name, selected="true") {
    const newOption = document.createElement("option");
    newOption.setAttribute("value", name);
    if(selected) newOption.setAttribute("selected", "");
    newOption.textContent  = name;
    selectBookshelf.appendChild(newOption);
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
      bookshelfForm.reset();
      bookshelfDialog.close();
    } catch (error) {
      console.error(error);
    }
  }

  function initBookshelf() {
    currentBookshelf().forEach( book => {
      const bookData = [];
      for (const elem in book) {
        bookData.push(book[elem]);
      }
      const storedBook = new Book(...bookData);
      storedBook.setBookcard();
      displayBookcard(storedBook);
    });
  }

  function initLibrary() {
    if(!getStoredLibrary()) {
      const exampleBookshelf = new Bookshelf("example");
      exmpLibData.forEach( bookData => {
        const newBook = new Book(...bookData);
        newBook.generateUuid();
        exampleBookshelf[exampleBookshelf.name].push(newBook);
        newBook.setBookcard();
        displayBookcard(newBook);
      });
      library.push(exampleBookshelf);
      storeLibrary();
      storeIndex(0);
    } else {
      library.push(...getStoredLibrary());
      initBookshelf();
    }
    library.forEach( shelf => addBookshelfOption(shelf.name, getIndex(shelf.name) === Number(getStoredIndex()) ? true : false));
  }

  function setStarDisplay() {
    stars.forEach( star => {
      if(star.value <= rating) {
        star.checked = true;
      } else {
        star.checked = false;
      }
      });
  }

  function setRating(ev) {
    if (ev.target.checked) {
      rating = Number(ev.target.value);
    } else {
      rating = rating > Number(ev.target.value) ?
        Number(ev.target.value) : --rating;
    }
    setStarDisplay();
  }

  bookForm.addEventListener("submit", createBook);
  selectBookshelf.addEventListener("change", changeBookshelf);
  bookshelfForm.addEventListener("submit", createBookshelf);
  inputBookshelfName.addEventListener("input", () => {
    if(library.every( shelf => shelf.name !== inputBookshelfName.value)) {
      inputBookshelfName.setCustomValidity("");
    } else {
      inputBookshelfName.setCustomValidity("A bookshelf with this name already exists!");
    }
  });
  stars.forEach( star => star.addEventListener("change", setRating));
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
