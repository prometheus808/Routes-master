let express = require('express');
let router = express.Router();

/**
 *      This is a fun little stop along the way.
 *      All URL requests will come through here
 *      let's print them one by one
 */
router.use(function timeLog ( req, res, next) {
    console.log("'What''s up? " + req.url);
    next();             //  definitely do NOT forget to do this!!
});

/***
 *      Books listing.
 *          just going to grab the array of all books and pass to the interpreter
 */
router.get('/', function(req, res, next) {
    //  ViewBag is just a tip of the hat back to the C# class
    //  The data model passed to the Pug interpreter can be named anything
    //  This example shows creating a empty JSON file and then assigning values as needed
    let ViewBag = {};
    ViewBag.title = 'I Love Books';
    ViewBag.library = books;
    res.render('books', ViewBag);
});

/**
 *      New Book
 *          nothing much to do, just render the create page.
 */
router.get('/new', function(req, res, next) {
    res.render('create');
});

/**
 *      Create the Book
 *          Test the query values to see if the necessary fields are populate
 *          if not redispaly the create page with error messages
 */
router.get('/create', function(req, res, next) {

    //  We are going to create the Book object first; warts and all
    //  then if there are errors we will return the book and at least data that was entered will be available
    let book = new Book(req.query.title, req.query.author);
    book.ISBN = req.query.ISBN;
    book.pages = req.query.pages;
    book.pages = req.query.pages;
    book.theme = req.query.theme;
    book.votes = req.query.votes;
    let error = {};
    let dateEntryError = false;
    //  If there are missing fields we will add message that are field specific to the
    //  data object going to the page
    if ( req.query.ISBN.length == 0) {
        book.ISBNerror = "Please check ISBN field";
        dateEntryError = true;
    }
    if ( req.query.title.length == 0) {
        book.TitleError = "Please check Title field";
        dateEntryError = true;
    }
    if ( req.query.author.length == 0) {
        book.AuthorError = "Please check Author field";
        dateEntryError = true;
    }

    //  How did the user do?
    if ( dateEntryError ) {
        //  not good.
        //  redisplay the create page with the found errors
        //  any previous data will is still here to display
        res.render('create', book);
    }
    else {
        //  looks like we passed with the required fields
        //  save the book and redirect to the list page
        books.push(book);
        res.redirect('/books');
    }
});

/**
 *      Prepare a Book for editing
 *          Find the book from the req.params object with the matching ISBN number
 *          render the edit page with the identified book
 */
router.get('/edit/:ISBN', function(req, res, next) {
    //  We are using the 'for of' loop because it returns the Book objects and that is what we want most
    for(let book of books) {
        if (book.ISBN == req.params.ISBN) {
            res.render('edit', book);
            break;
        }
    }
});

/**
 *      Simple end point for capturing HTTP Methods besides GET
 *          We will use curl and Postman to test this out
 */
router.post('/edit/:ISBN', function(req, res, next) {
    res.send('Here we are');
});

/**
 *      Book as been edited
 *          now update the fields
 */
router.get('/save', function(req, res, next) {
    for(let book of books) {
        if (book.ISBN == req.query.ISBN) {
            book.title  =   req.query.title;
            book.author =   req.query.author;
            book.pages  =   req.query.pages;
            book.theme  =   req.query.theme;
            book.votes  =   req.query.votes;
            break;
        }
    }
    res.redirect('/books');
});

/**
 *      show Book details
 *          find the Book with the matching ISBN and render the Book detail page
 */
router.get('/:ISBN', function(req, res, next) {
    for(let book of books) {
        if (book.ISBN == req.params.ISBN) {
            res.render('book', book);
            break;
        }
    }
});

/**
 *      delete the Book
 *          Show the revised Book list at the end
 */
router.get('/delete/:ISBN', function(req, res, next) {
    //  this time searching for the Book we are most interested in the INDEX of the Book
    //  because then we can use that index to SPLICE the book out of the books array
    for(let bookIndex in books) {
        if (books[bookIndex].ISBN == req.params.ISBN) {
            books.splice(bookIndex,1);
            break;
        }
    }
    res.redirect('/books');
});

/**
 *      Set up functions and necessary variables
 */
let books = [];                         //  our very useful array of Books
let themes = ['Mystery', 'Sci Fi', 'Romance', 'YA', 'Fiction'];     //  just a list of themes the randomly choose from

/**
 *      Book constructor
 * @param title
 * @param author
 * @param votes
 * @constructor
 *          Along the way we will randomly generate an ISBN, number of pages and the book's theme
 */
let Book = function(title, author) {
    this.ISBN    = Math.floor(Math.random()*1000000);
    this.title   = title;
    this.author  = author;
    this.votes   = Math.floor(Math.random()*5000)+1000;
    this.reviews = getReviews();
    this.pages = Math.floor(Math.random()*400)+200;
    this.theme = themes[Math.floor(Math.random()*5)];
};

/**
 *      just a function to randomly generate an array of Reviews for each movie
 * @returns {Array}
 */
function getReviews() {
    let reviews = [];
    let max = Math.floor(Math.random()*4);
    let lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    for ( let i = 0; i < max; i++) {
        let start = Math.abs(Math.floor(Math.random()*lorem.length)-200);
        let end = Math.floor(Math.random()*400);
        reviews.push(lorem.slice(start,start+end));
    }
    return reviews;
}

/**
 *      Create our initial Book list
 */
function addBooks() {
    books.push(new Book('Harry Potter and the Half-Blood Prince', 'J. K. Rowling'));
    books.push(new Book('The Hunger Games', 'Suzanne Collins'));
    books.push(new Book('Harry Potter and the Order of the Phoenix', 'J. K. Rowling'));
    books.push(new Book('The Da Vinci Code', 'Dan Brown'));
    books.push(new Book('To Kill a Mockingbird', 'Harper Lee'));
    books.push(new Book('Harry Potter and the Deathly Hallows', 'J. K. Rowling'));
    books.push(new Book('The Hobbit; or There and Back Again', 'J. R. R. Tolkien'));
    books.push(new Book('Harry Potter and the Philosopher\'s Stone', 'J. K. Rowling'));
    books.push(new Book('The Great Gatsby', 'F. Scott Fitzgerald'));
    books.push(new Book('Twilight', 'Stephenie Meyer'));
    books.push(new Book('Harry Potter and the Chamber of Secrets', 'J. K. Rowling'));
    books.push(new Book('Harry Potter and the Prisoner of Azkaban', 'J. K. Rowling'));
    books.push(new Book('1984', 'George Orwell'));
    books.push(new Book('The Catcher in the Rye', 'J. D. Salinger'));
    books.push(new Book('Harry Potter and the Goblet of Fire', 'J. K. Rowling'));
    books.push(new Book('Pride and Prejudice', 'Jane Austen'));
}

/*
 *  This little line of code will initialize our books array when this module is initially 'required'
 */
addBooks();

//  make our export endpoints visible to the world
module.exports = router;
