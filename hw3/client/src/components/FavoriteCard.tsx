import { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getArtistInfo, ArtistInfoType, Favorite } from '../utils/api';
import RelativeTime from './RelativeTime';

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
    <Card
      className="favorite-card mb-3 text-white b-0"
      onClick={handleCardClick}
      style={{ cursor: 'pointer', overflow: "hidden", height: "180px", width: "350px" }}
    >
      <Card.Img variant="top" src={favorite.imgUrl}
        style={{ filter: 'blur(5px) brightness(0.5)', objectFit: 'cover', height: '100%' }}
      />
      <Card.ImgOverlay>
        <Card.Title as="h3" className="mx-2">
          {artistDetails ? artistDetails.name : favorite.title}
        </Card.Title>
      {artistDetails && (
        <Card.Text>
        <span className="m-2">
          {artistDetails.birthday && <span>{artistDetails.birthday}</span>}
          {artistDetails.birthday && artistDetails.deathday && <span> - </span>}
          {artistDetails.deathday && <span>{artistDetails.deathday}</span>}
        </span>
        <span className="m-2">
          {artistDetails.nationality && <span>{artistDetails.nationality}</span>}
        </span>
        </Card.Text>
      )}
      <div className="mx-2" style={{ position: 'absolute', bottom: '20px' }}>
        <RelativeTime time={favorite.addedAt} />
      </div>
      <Button
        variant="link text-white"
        onClick={handleRemoveClick}
        style={{ position: 'absolute', bottom: '15px', right: '10px' }}
      >
        Remove
      </Button>
      </Card.ImgOverlay>
    </Card>
  );
};

export default FavoriteCard;