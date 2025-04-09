import React, { useState, useEffect } from 'react';
import { Container, Spinner, Tabs, Tab } from 'react-bootstrap';
import Artworks from './Artworks';
import ArtistInfo from './ArtistInfo';
import { ArtistInfoType, getArtistInfo } from '../utils/api';

interface ArtistDetailProps {
    artistId: string;
}

const ArtistDetails: React.FC<ArtistDetailProps> = ({ artistId }) => {
    const [artistInfo, setArtistInfo] = useState<ArtistInfoType | null>(null);
    const [loading, setLoading] = useState(false);

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
                                <ArtistInfo artistInfo={artistInfo} />
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