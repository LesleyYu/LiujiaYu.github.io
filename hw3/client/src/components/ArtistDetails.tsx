import React, { useState, useEffect } from 'react';
import { Container, Spinner, Tabs, Tab, Card } from 'react-bootstrap';
import Artworks from './Artworks';
import ArtistInfo from './ArtistInfo';
import { ArtistInfoType, getArtistInfo, getSimilarArtists, SimilarArtist } from '../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FavoriteButton from './FavoriteButton';

interface ArtistDetailProps {
  artistId: string;
}

const ArtistDetails: React.FC<ArtistDetailProps> = ({ artistId }) => {
  const [artistInfo, setArtistInfo] = useState<ArtistInfoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [similarArtists, setSimilarArtists] = useState<SimilarArtist[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
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
        const similar = await getSimilarArtists(artistId);
        setSimilarArtists(similar);
      } catch (error) {
        console.error("Error fetching similar artists:", error);
      }
    };

    fetchSimilarArtists();
  }, [artistId]);

  return (
    <Container fluid className="d-flex flex-column min-vh-100 pb-5">
      <Container className="my-3 text-start">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center flex-column">
              <Tabs defaultActiveKey="artistInfo" className="w-100 mb-5" fill variant="pills">
                <Tab eventKey="artistInfo" title="Artist Info">
                </Tab>
                <Tab eventKey="artworks" title="Artworks">
                </Tab>
              </Tabs>
            <div className="d-flex justify-content-center w-100">
              <Spinner id="info-spinner" animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          </div>
        ) : (
          artistInfo && (
            <Tabs defaultActiveKey="artistInfo" fill variant="pills" className="mb-3">
              <Tab eventKey="artistInfo" title="Artist Info">
                <ArtistInfo artistInfo={artistInfo} artistId={artistId} />
                {/** SimilarArtists here */}
                {isAuthenticated && similarArtists.length > 0 && (
                  <>
                    <h5 className="mt-4">Similar Artists</h5>
                    <div className="d-flex overflow-auto flex-nowrap my-3 mx-auto">
                      {similarArtists.map((artist, index) => (
                        <Card
                          bg="dark" text="white" key={index}
                          className={`mx-1 border-0 myCard ${activeCard === index ? 'active-card' : ''}`}
                          onClick={() => {
                            setActiveCard(index);
                            // Preserve any existing search state so original SearchResults remain listed
                            navigate(`/artist/${artist.id}`, { state: { ...location.state, preserveSearch: true } });
                          }}
                        >
                          <Card.Img
                            variant="top" src={artist.imgUrl}
                            style={{ height: "198px", width: "198px", objectFit: "cover" }}
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              e.currentTarget.src = "/assets/artsy_logo.svg";
                            }}
                            alt={artist.name}
                          />
                          <div
                            className='myFavIconOnCard position-absolute rounded-circle d-flex justify-content-center align-items-center'
                            style={{ top: '10px', right: '10px', width: '32px', height: '32px' }}
                          >
                            <FavoriteButton artistId={artist.id} />
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