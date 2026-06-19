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

  function BookShelf(name) {
    if (!new.target) throw Error("Missing Operator", "The 'new' operator is required for using the constructor function.");
    if (arguments[0] === "" || arguments[0] === undefined)
      throw Error("Missing Argument", "The bookshelf needs a name.");
    this.name = name;
    this.bookshelf = [];
  }

  function Book(title, author = "", category = "", year = 2026, pages = 0, read = false, rating = 0) {
    if (!new.target) throw Error("Missing Operator", "The 'new' operator is required for using the constructor function.");
    if (arguments[0] === "" || arguments[0] === undefined)
      throw Error("Missing Argument", "The Book needs at least a title.");
    this.title = title;
    this.author = author;
    this.category = category;
    this.year = year;
    this.pages = pages;
    this.read = read;
    this.rating = rating;
    this.uuid = crypto.randomUUID();
  }

  function createBookCard(book) {
    const container = document.querySelector(".container");
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

  const shelfTest = new BookShelf("default");
  console.log(shelfTest);
  exmpLibData.forEach( b => {
    const newBook = new Book(...b);
    shelfTest.bookshelf.push(newBook);
    createBookCard(newBook);
  })
  const bookTest = new Book("The Godfather", "Mario Puzo", "Crime Novel", 1969, 446, true, 5);
  console.log(bookTest);
  createBookCard(bookTest);

  const preferredScheme = () => getComputedStyle(document.documentElement).getPropertyValue("color-scheme");
  document.querySelector(".scheme-toggle").addEventListener("click", () => {
    document.documentElement.style.setProperty("color-scheme",
      preferredScheme() === "light" ? "dark" : "light");
  });

})();
