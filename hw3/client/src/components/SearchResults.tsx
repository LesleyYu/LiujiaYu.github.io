import React, { useState } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { Artist } from '../utils/api';

interface SearchResultsProps {
  artists: Artist[];
  searchInitiated?: boolean;
  setArtistId: (id: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ artists, searchInitiated, setArtistId }) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  if (!artists.length) {
    return searchInitiated ? (
      <Alert variant="danger" className="mx-auto my-3" style={{ minWidth: '45%' }}>
        No results.
      </Alert>
    ) : null;
  }

  return (
    <div
      className="d-flex overflow-auto flex-nowrap my-3 mx-auto"
    >
      {artists.map((artist, index) => (
        <Card
          bg='dark'
          text='white'
          key={index}
          className={`mx-1 myCard ${activeCard === index ? 'active-card' : ''}`}
          onClick={() => {
            // Extract artist id from bioUrl
            // const parts = artist.bioUrl.split('/');
            // const id = parts[parts.length - 1];
            setArtistId(artist.id);
            setActiveCard(index);
          }}
        >
          <Card.Img 
            variant="top" 
            src={artist.imgUrl} 
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src = "/assets/artsy_logo.svg";
            }}
            alt={artist.title}
          />
          <Card.Body style={{ maxHeight: "45px"}}>
            <Card.Title as="div">{artist.title}</Card.Title>
          </Card.Body>
        </Card>
      ))}

    </div>
  );
};

export default SearchResults;
