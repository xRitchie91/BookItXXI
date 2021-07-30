// imports like a GTR, but less cooler, but also not a car..
// these pull from other files to make the page work.
import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations'
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

// self explanitory, but saved books function
const SavedBooks = () => {
  const {loading, error, data } = useQuery(GET_ME)
  const [removeBook] = useMutation(REMOVE_BOOK)

  const userData = data?.me || {};
  if(loading){
    return <div>Loading...</div>
  }
  if(error){
    console.log(error)
    return <div>Error!</div>
  }

  // book's mongo _id value as param and deletes the book from database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
        await removeBook({
        variables: { bookId }
      });

      removeBookId(bookId)
    }
    catch (e) {
      console.error(e)
    }
  }

  // loading screen
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // loading screen the sequel
  if (!userDataLength) {
    return <h2>LOADING... We all love waiting 😤</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Your saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;