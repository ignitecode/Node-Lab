const http = require('http');
const fs = require('fs');
const urlParser = require('url');

const port = process.env.PORT || 5000
const server = http.createServer().listen(port);

console.log('[INFO] Server is listening on port: ', port);

server.on('request', (req, res) => {
  const urlObject = urlParser.parse(req.url);

  // Respond with HTML title and some text.
  res.writeHead(200, { 'Content-Type': 'text/html'});
  res.write('<html>');
  res.write('<h1>Tom Cruise Movies</h1>');
  res.write('<h3>You have reached the ' + urlObject.pathname + '</h3>');

  // Retrieve all movies from our Database.
  let movies = getMovies();

  if(urlObject.query !== null) {
    let key = urlObject.query.substring(0,  urlObject.query.indexOf('='));
    let value = decodeURI(urlObject.query.substring(urlObject.query.indexOf('=') + 1, urlObject.query.length));

    // Update movies to include the filtered list from the query params
    movies = movies.filter(movie => movie[key].toUpperCase().includes(value.toUpperCase()));
  }

  res.write('<ul>');

  // Switch between different "pages" of our App.
  switch(urlObject.pathname) {
    case "/":
        // For Each movie write it in the response
        movies.forEach(movie => {
            res.write('<li>' + movie.Title + '</li>');
          });
          break;
    case "/movies":
          res.write('<a href="/books">Books</a>');
          break;
    case "/books":
      res.write('<p>You\'ve reached the books page</p>');
      break;
    default:
        res.write('<p>Sorry I didnt recognize that route</p>');
  }

  // Finish up by closing all our un-closed HTML tags
  res.write('</ul>');
  res.write('</html>');
});

/**
 * Returns a list of Tom Cruise Movies after
 * the data has bee read from the makeshift database (data.json) file.
 */
const getMovies = () => {
  const movies = fs.readFileSync('./data.json');
  return JSON.parse(movies);
}
