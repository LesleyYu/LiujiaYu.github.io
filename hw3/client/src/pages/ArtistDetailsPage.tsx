import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Spinner, Tabs, Tab } from 'react-bootstrap';
import Artworks from '../components/Artworks';
import ArtistInfo from '../components/ArtistInfo';
import { ArtistInfoType, getArtistInfo } from '../utils/api';
import SearchResults from '../components/SearchResults';

const ArtistDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [artistInfo, setArtistInfo] = useState<ArtistInfoType | null>(null);
  const [loading, setLoading] = useState(false);

  // Optional: if search state is passed along, you can extract it:
  const searchState = location.state as { artists?: any[], searchInitiated?: boolean } | undefined;

  useEffect(() => {
    if (!id) return;
    const artistId: string = id;
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
  }, [id]);

  return (
    <Container fluid className="d-flex flex-column min-vh-100 pb-5">
      {searchState && searchState.artists && searchState.searchInitiated && (
        <>
          <SearchResults 
            artists={searchState.artists} 
            searchInitiated={true}
            // Depending on your design you might want to disable navigating 
            // (or update search state) when an artist is already selected.
            setArtistId={() => {}} 
          />
        </>
      )}

      <Container className="my-3 text-start">
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner id="info-spinner" animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          artistInfo && (
            <Tabs defaultActiveKey="artistInfo" fill variant="pills" className="mb-3">
              <Tab eventKey="artistInfo" title="Artist Info">
                <ArtistInfo artistInfo={artistInfo} />
              </Tab>
              <Tab eventKey="artworks" title="Artworks">
                <Artworks artistId={id!} />
              </Tab>
            </Tabs>
          )
        )}
      </Container>
    </Container>
  );
};

export default ArtistDetailsPage;