"use strict";

const library1a = ( () => {

  const exmpLibData = [
    [ "Brave New World", "Aldous Huxley", "Dystopia", 1932, 310, true, 5 ],
    [ "Nineteen Eighty-Four", "George Orwell", "Dystopia", 1949, 382, true, 5 ],
    [ "Animal Farm: A Fairy Story", "George Orwell", "Fable", 1945, 141, true, 5 ],
    [ "The Stone And The Flute", "Hans Bemmann", "Fairy tale", 1983, 935, true, 5 ],
    [ "The Hundred-Year-Old Man Who Climbed Out The Window And Disappeared", "Jonas Jonasson", "Comic Novel", 2009, 413, true, 5 ],
    [ "The Man Who Planted Trees", "Jean Giono", "Allegory", 1953, 71, true, 5],
    [ "Harry Potter And The Deathly Hallows", "Joanne K. Rowling", "Fantasy", 2007, 767, false, 0 ],
    [ "The Hobbit", "J.R.R. Tolkien", "Children's Fantasy", 1937, 320, true, 5 ],
    [ "The Lord Of The Rings", "J.R.R. Tolkien", "Fantasy", 1955, 1178, true, 5 ],
    [ "The Dark Tower", "Stephen King", "Fantasy", 2012, 4720, true, 5 ],
    [ "The Talisman", "Peter Straub, Stephen King", "Fantasy", 1984, 784, true, 5 ],
  ];

  const library = [];

  function Bookshelf(name) {
    if (!new.target) throw Error("The 'new' operator is required for using the constructor function.");
    if (arguments[0] === "" || arguments[0] === undefined)
      throw Error("The bookshelf needs a name.");
    this.name = name;
    this[name] = [];
  }

  function Book(title, author = "", category = "", year = 2026, pages = 0, read = false, rating = 0) {
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
    this.uuid = crypto.randomUUID();
  }

  const preferredScheme = () => getComputedStyle(document.documentElement).getPropertyValue("color-scheme");
  const getStoredIndex = () => localStorage.getItem("lib1a_stored-index");
  const storeIndex = number => localStorage.setItem("lib1a_stored-index", number);
  const getIndex = value => library.findIndex( shelf => shelf.name === value);
  const storeLibrary = () => localStorage.setItem("lib1a_library", JSON.stringify(library));
  const getStoredLibrary = () =>JSON.parse(localStorage.getItem("lib1a_library"));
  const container = document.querySelector(".container");
  const selectBookshelf = document.querySelector("#shelf-select");
  const bookshelfDialog = document.querySelector("#bookshelf_dialog");
  const bookshelfForm = document.querySelector("#bookshelf_form");
  const inputBookshelfName = document.querySelector("#bookshelf_name");
  const stars = document.querySelectorAll(".star input");
  let rating = 0;

  function createBookCard(book) {
    const template = document.querySelector("#book-card-template");
    const cloneCard = document.importNode(template.content, true);
    cloneCard.querySelector(".book-card").setAttribute("id", book.uuid);
    cloneCard.querySelector(".book-title").textContent = book.title;
    cloneCard.querySelector(".book-author").textContent = book.author;
    cloneCard.querySelector(".book-category").textContent = book.category;
    cloneCard.querySelector(".book-year").textContent = book.year;
    cloneCard.querySelector(".book-pages").textContent = book.pages;
    cloneCard.querySelector(".book-read").textContent = book.read;
    cloneCard.querySelector(".book-rating").textContent = book.rating;
    container.appendChild(cloneCard);
  }

  function changeBookshelf() {
    container.querySelectorAll("div").forEach( div => div.remove());
    storeIndex(getIndex(selectBookshelf.value));
    library[getStoredIndex()][library[getStoredIndex()].name].forEach( bookData => createBookCard(bookData));
  }

  function addBookshelfOption(name, selected="true") {
    console.log(selected);
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

  function initLibrary() {
    if(!getStoredLibrary()) {
      const exampleBookshelf = new Bookshelf("example");
      exmpLibData.forEach( bookData => {
        const newBook = new Book(...bookData);
        exampleBookshelf[exampleBookshelf.name].push(newBook);
        createBookCard(newBook);
      });
      library.push(exampleBookshelf);
      storeLibrary();
      storeIndex(0);
    } else {
      library.push(...getStoredLibrary());
      library[getStoredIndex()][library[getStoredIndex()].name].forEach( bookData => createBookCard(bookData));
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
  document.querySelector("footer button").addEventListener("click", () => {
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

  // const bookTest = new Book("The Godfather", "Mario Puzo", "Crime Novel", 1969, 446, true, 5);
  // createBookCard(bookTest);
