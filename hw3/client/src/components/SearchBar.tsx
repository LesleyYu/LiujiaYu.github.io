import React, { useState } from 'react';
import { Form, InputGroup, Button, Spinner, Alert } from 'react-bootstrap';

interface SearchBarProps {
  loading: boolean;
  onSearch: (query: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ loading, onSearch, onClear }) => {
  const [query, setQuery] = useState('');
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() === '') {
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    onSearch(query.trim());
  };

  const clearSearch = () => {
    setQuery('');
    onClear();
  };

  return (
    <>
      {showAlert && (
        <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
          Please enter an artist name.
        </Alert>
      )}
      <Form onSubmit={handleSubmit} className="my-3">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Please enter an artist name."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <Button 
            variant="primary" 
            type="submit" 
            className='search-btn border-0'
            disabled={query.trim() == ''}
          >
            Search
            {
              loading ?
              <Spinner 
                variant='light'
                size='sm'
                animation="border"
                role="status"
                className='ml-1'
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner> :
              <></>
            }
          </Button>
          <Button variant="secondary" onClick={clearSearch} type="button">
            Clear
          </Button>
        </InputGroup>
      </Form>
    </>
  );
};

export default SearchBar;