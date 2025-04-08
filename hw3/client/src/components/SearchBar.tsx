import React, { useState } from 'react';
import { Form, InputGroup, Button, Spinner } from 'react-bootstrap';

interface SearchBarProps {
  loading: boolean;
  onSearch: (query: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ loading, onSearch, onClear }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() === '') return;
    onSearch(query.trim());
  };

  const clearSearch = () => {
    setQuery('');
    onClear();
  };

  return (
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
  );
};

export default SearchBar;