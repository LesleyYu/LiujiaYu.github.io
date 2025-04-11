import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarFill } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { addFavorite, removeFavorite } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

interface FavoriteButtonProps {
  artistId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ artistId }) => {
  const { user, setUser } = useAuth();
  const { addNotification } = useNotification();

  // Determine if the artist is currently a favorite
  const isFavorited = user?.favorites?.some((fav: { artistId: string; }) => fav.artistId === artistId);

  const handleToggleFavorite = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Prevent parent onClick (e.g. Card click) from triggering.
    e.stopPropagation();

    try {
      if (isFavorited) {
        // Remove from favorites
        // console.log('Removing from favorites:', artistId);
        const updatedFavorites = await removeFavorite(artistId);
        // Update user state with new favorites list.
        setUser((prevUser) => prevUser ? { ...prevUser, favorites: updatedFavorites } : prevUser);
        addNotification({ message: 'Removed from favorites', variant: 'danger' });
      } else {
        // Add to favorites
        // console.log('Adding from favorites:', artistId);
        const updatedFavorites = await addFavorite(artistId);
        // Update user state with new favorites list.
        setUser((prevUser) => prevUser ? { ...prevUser, favorites: updatedFavorites } : prevUser);
        addNotification({ message: 'Added to favorites', variant: 'success' });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Optionally add an error notification here.
    }
  };

  return (
    <div onClick={handleToggleFavorite} >
      {isFavorited ?
        <FontAwesomeIcon icon={faStarFill} style={{ color: '#f3c93e' }} /> :
        <FontAwesomeIcon icon={faStar} style={{ color: 'white' }} />
      }
    </div>
  );
};

export default FavoriteButton;