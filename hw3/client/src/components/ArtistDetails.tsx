import React, { useState, useEffect } from 'react';
import { Container, Spinner, Tabs, Tab, Card } from 'react-bootstrap';
import Artworks from './Artworks';
import ArtistInfo from './ArtistInfo';
import { ArtistInfoType, getArtistInfo, getSimilarArtists, SimilarArtist } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FavoriteButton from './FavoriteButton';

interface ArtistDetailProps {
  artistId: string;
}

const ArtistDetails: React.FC<ArtistDetailProps> = ({ artistId }) => {
  const [artistInfo, setArtistInfo] = useState<ArtistInfoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [similarArtists, setSimilarArtists] = useState<SimilarArtist[]>([]);
  const [similarArtistId, setSimilarArtistId] = useState<string>(artistId);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      try {
        const data = await getArtistInfo(artistId);
        setArtistInfo(data);
      } catch (error) {
        console.error("Error fetching artist details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  // Fetch similar artists whenever artistId changes
  useEffect(() => {
    const fetchSimilarArtists = async () => {
      try {
        const similar = await getSimilarArtists(similarArtistId);
        setSimilarArtists(similar);
      } catch (error) {
        console.error("Error fetching similar artists:", error);
      }
    };

    fetchSimilarArtists();
  }, [similarArtistId]);

  return (
    <Container fluid className="d-flex flex-column min-vh-100 pb-5">
      <Container className="my-3 text-start">
        {loading ? (
          <div className=' d-flex justify-content-center'>
            <Spinner id="info-spinner" animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          artistInfo && (
            <Tabs defaultActiveKey="artistInfo" fill variant="pills" className="mb-3">
              <Tab eventKey="artistInfo" title="Artist Info">
                <ArtistInfo artistInfo={artistInfo} artistId={artistId} />
                {/** SimilarArtists here */}
                { isAuthenticated && similarArtists.length > 0 && (
                  <>
                    <h5 className="mt-4">Similar Artists</h5>
                    <div className="d-flex overflow-auto flex-nowrap my-3 mx-auto">
                      {similarArtists.map((artist, index) => (
                        <Card
                          bg="dark" text="white" key={index}
                          className={`mx-1 border-0 myCard ${activeCard === index ? 'active-card' : ''}`}
                          onClick={() => {
                            setActiveCard(index);
                            setSimilarArtistId(artist.id);
                            navigate(`/artist/${artist.id}`, { state: {} });
                          }}
                        >
                          <Card.Img
                            variant="top" src={artist.imgUrl}
                            style={{ height: "198px", objectFit: "cover" }}
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              e.currentTarget.src = "/assets/artsy_logo.svg";
                            }}
                            alt={artist.name}
                          />
                          <div
                            className='myFavIconOnCard position-absolute rounded-circle d-flex justify-content-center align-items-center' 
                            style={{ top: '10px', right: '10px', width: '32px', height: '32px'}}
                          >
                            <FavoriteButton artistId={artist.id}/>
                          </div>
                          <Card.Body style={{ maxHeight: "43px" }}>
                            <Card.Title as="div">{artist.name}</Card.Title>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </Tab>
              <Tab eventKey="artworks" title="Artworks">
                <Artworks artistId={artistId} />
              </Tab>
            </Tabs>
          )
        )}
      </Container>
    </Container>
  );
};

export default ArtistDetails;