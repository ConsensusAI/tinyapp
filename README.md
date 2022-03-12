# TinyApp Project

TinyApp is a full stack web application that shortens URLs. It is built using Node for the web server, Express as middleware, and EJS as a template engine. Bootstrap is also used as the CSS framework. Its functionality allows users to
submit URLs that are automatically shortened. Users may view all their created URLs, edit the redirected URLs, and delete them (CRUD functionality).

## Final Product

Login Page ![Login Page](https://github.com/ConsensusAI/tinyapp/blob/master/screenshots/tinyapp-login.png)
Shortened URL Page ![Shortened URL Page](https://github.com/ConsensusAI/tinyapp/blob/master/screenshots/tinyapp-url-show.png)
My URLs Index ![My URLs Index](https://github.com/ConsensusAI/tinyapp/blob/master/screenshots/tinyapp-urls-index.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command from the /src directory.

## Features

- Users can register accounts, log in, and log out.
- URLs can be shortened using the Create New URL tab.
- Shortened URLs can be updated on the shortURL page.
- Shortened URLs can be deleted.

### Acknowledgements

1. Shoutout to @kvirani and @lighthouse-labs for guiding me along this learning journey. [Check them out!](https://www.lighthouselabs.ca/) [^1]
2. Thank you to the developers who created and shared the node modules used.

[^1]: https://github.com/lighthouse-labs/
