import React, { useState } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { Artist } from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface SearchResultsProps {
  artists: Artist[];
  searchInitiated?: boolean;
  setArtistId: (id: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ artists, searchInitiated, setArtistId }) => {
  const navigate = useNavigate();

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
            setArtistId(artist.id);
            setActiveCard(index);
            // navigate(`/artist/${artist.id}`); // If I do this, the SearchResults will disappear, which should be avoided. 
            navigate(`/artist/${artist.id}`, { state: { artists, searchInitiated } })
             // todo: ArtistDetail Page
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
          <Card.Body style={{ maxHeight: "43px"}}>
            <Card.Title as="div">{artist.title}</Card.Title>
          </Card.Body>
        </Card>
      ))}

    </div>
  );
};

export default SearchResults;
