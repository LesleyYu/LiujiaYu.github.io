import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import FavoriteCard from '../components/FavoriteCard';
import { getFavorites, removeFavorite, Favorite } from '../utils/api';

// Module-level cache to preserve favorites between page navigations
let cachedFavorites: Favorite[] | null = null;
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