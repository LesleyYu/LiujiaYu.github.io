import React, { useEffect, useState } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Artist } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import FavoriteButton from './FavoriteButton';

interface SearchResultsProps {
  artists: Artist[];
  searchInitiated?: boolean;
  currentArtistId?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ artists, searchInitiated, currentArtistId }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    if (currentArtistId && activeCard && artists[activeCard].id !== currentArtistId) {
      const index = artists.findIndex(artist => artist.id === currentArtistId);
      setActiveCard(index);
    }
  }, [currentArtistId, artists, activeCard]);

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
      {/** stars on every Card below. Star should be on the top right corner of the card */}
      {artists.map((artist, index) => (
        <Card
          bg='dark'
          text='white'
          key={index}
          className={`mx-1 border-0 myCard ${activeCard === index ? 'active-card' : ''}`}
          onClick={() => {
            setActiveCard(index);
            //  ArtistDetail Page with preserved search state so SearchResults remain
            navigate(`/artist/${artist.id}`, { state: { artists, searchInitiated, preserveSearch: true } });
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
            { isAuthenticated && 
              <div 
                className='myFavIconOnCard position-absolute rounded-circle d-flex justify-content-center align-items-center' 
                style={{ top: '10px', right: '10px', width: '32px', height: '32px'}}
              >
                <FavoriteButton artistId={artist.id} />
              </div>
            }
            <Card.Body style={{ maxHeight: "43px" }}>
            <Card.Title as="div">{artist.title}</Card.Title>
            </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
