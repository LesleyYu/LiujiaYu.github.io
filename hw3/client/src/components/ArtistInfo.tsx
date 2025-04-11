import { ArtistInfoType } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import FavoriteButtonInBio from './FavoriteButtonInBio';

interface ArtistInfoProps {
  artistInfo: ArtistInfoType;
  artistId: string;
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({ artistInfo, artistId }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="artist-bio">
      <div className='d-flex justify-content-center' >
        <div className="text-center d-inline-flex" 
           style={{ fontSize: '22px', marginBottom: '-1px' }}>
          <span style={{ margin: "0 10px 0 30px"}}>{artistInfo.name}</span>
          {/** a star here */}
          {isAuthenticated && 
            <span className="myFavIcon" style={{ marginTop: "-2px", cursor: "pointer" }} >
              <FavoriteButtonInBio artistId={artistId} />
            </span>
          }
        </div>
      </div>
      <p className="text-center" style={{ fontSize: '16px' }}>
        {artistInfo.nationality ? artistInfo.birthday ? artistInfo.deathday ? 
        `${artistInfo.nationality}, ${artistInfo.birthday} - ${artistInfo.deathday}`:
        <></> : <></> : <></>
        }
      </p>
      {artistInfo.biography &&
      artistInfo.biography.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={index} style={{ fontSize: '14px', lineHeight: 1.2, textAlign: 'justify' }}>
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default ArtistInfo;