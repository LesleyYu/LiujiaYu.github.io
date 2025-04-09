import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getArtistInfo, ArtistInfoType, Favorite, getFavorites, removeFavorite } from '../utils/api';

// Module-level cache to preserve favorites between page navigations
let cachedFavorites: Favorite[] | null = null;

// A component that computes and displays relative time auto updating every second.
const RelativeTime: React.FC<{ time: string }> = ({ time }) => {
  const [relative, setRelative] = useState('');

  const computeRelative = () => {
    const now = new Date();
    const past = new Date(time);
    const diffSec = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (diffSec < 60) {
      return `${diffSec || 1} second${diffSec === 1 ? '' : 's'} ago`;
    }
    const minutes = Math.floor(diffSec / 60);
    if (minutes < 60) {
      return `${minutes || 1} minute${minutes === 1 ? '' : 's'} ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours || 1} hour${hours === 1 ? '' : 's'} ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  useEffect(() => {
    setRelative(computeRelative());
    const interval = setInterval(() => {
      setRelative(computeRelative());
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  return <span>{relative}</span>;
};

// A FavoriteCard component renders each artist's card.
const FavoriteCard: React.FC<{ favorite: Favorite; onRemove: (id: string) => void }> = ({ favorite, onRemove }) => {
  const navigate = useNavigate();
  const [artistDetails, setArtistDetails] = useState<ArtistInfoType | null>(null);

  // Fetch detailed artist information for additional fields
  useEffect(() => {
    getArtistInfo(favorite.artistId)
      .then((details) => {
        setArtistDetails(details);
      })
      .catch((err) => {
        console.error('Failed to fetch artist details:', err);
      });
  }, [favorite.artistId]);

  // Clicking on the cardnavigates to Artist Details page
  const handleCardClick = () => {
    navigate(`/artist/${favorite.artistId}`);
  };

  // Remove button click: stop propagation so that the card click isn’t triggered
  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRemove(favorite.artistId);
  };

  return (
    <Card className="favorite-card mb-3" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <Card.Img variant="top" src={favorite.imgUrl} style={{ filter: 'blur(8px)' }} />
      <Card.Body>
        <Card.Title>{artistDetails ? artistDetails.name : favorite.title}</Card.Title>
        {artistDetails && (
          <Card.Text>
            {artistDetails.birthday && (
                <span>{artistDetails.birthday}</span>
            )}
            {artistDetails.birthday && artistDetails.deathday && (<span> - </span>)}
            {artistDetails.deathday && (
                <span> {artistDetails.deathday}</span>
            )}
            <br />
            {artistDetails.nationality && (
              <span>{artistDetails.nationality}</span>
            )}
          </Card.Text>
        )}
        <div className="mb-2">
          Added <RelativeTime time={favorite.addedAt} />
        </div>
        <Button variant="danger" onClick={handleRemoveClick}>
          Remove
        </Button>
      </Card.Body>
    </Card>
  );
};

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // On component mount, if we don’t have a cached list, fetch favorites
  useEffect(() => {
    if (!cachedFavorites) {
      setLoading(true);
      getFavorites()
        .then((favs) => {
          cachedFavorites = favs;
          setFavorites(favs);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching favorites:', err);
          setLoading(false);
        });
    } else {
      setFavorites(cachedFavorites);
    }
  }, []);

  // Handler to remove a favorite artist
  const handleRemove = async (artistId: string) => {
    try {
      const updatedFavs = await removeFavorite(artistId);
      cachedFavorites = updatedFavs;
      setFavorites(updatedFavs);
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  // Sort favorites: newest first (by addedAt timestamp)
  const sortedFavorites = [...favorites].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );

  return (
    <Container className="favorites-page py-4">
      <h2>Your Favorite Artists</h2>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {sortedFavorites.length === 0 ? (
            <p>No favorite artists</p>
          ) : (
            <Row>
              {sortedFavorites.map((fav) => (
                <Col md={4} key={fav.artistId}>
                  <FavoriteCard favorite={fav} onRemove={handleRemove} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default Favorites;