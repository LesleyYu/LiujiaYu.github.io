import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Row, Col, Alert } from 'react-bootstrap';
import { getArtWorks, Artwork as ArtworkType } from '../utils/api';
import CategoriesModal from './Categories';

interface ArtworksProps {
    artistId: string;
}

const Artworks: React.FC<ArtworksProps> = ({ artistId }) => {
    const [artworks, setArtworks] = useState<ArtworkType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasArtwork, setHasArtwork] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedArtwork, setSelectedArtwork] = useState<ArtworkType | null>(null);

    useEffect(() => {
        const fetchArtworks = async () => {
            setLoading(true);
            try {
                const data = await getArtWorks(artistId);
                if (data && data.length > 0) {
                    setArtworks(data);
                    setHasArtwork(true);
                } else {
                    setHasArtwork(false);
                }
            } catch (error) {
                console.error('Error fetching artworks: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtworks();
    }, [artistId]);

    const handleShowCategories = (artwork: ArtworkType) => {
        setSelectedArtwork(artwork);
        setShowModal(true);
    };

    return (
        <div>
            {loading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : hasArtwork ? (
                <Row>
                    {artworks.map((artwork) => (
                        <Col md={4} key={artwork.id} className="mb-4">
                            <Card>
                                <Card.Img variant="top" src={artwork.imgUrl} alt={artwork.title} />
                                <Card.Body>
                                    <Card.Title>{artwork.title}</Card.Title>
                                    <Card.Text>{artwork.date}</Card.Text>
                                    <Button variant="primary" onClick={() => handleShowCategories(artwork)}>
                                        Categories
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                ) : (
                <Alert variant="danger" className="mx-auto my-3" style={{ minWidth: '45%' }}>
                    No artworks.
                </Alert>
            )}
            {selectedArtwork && (
                <CategoriesModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    artworkId={selectedArtwork.id}
                    artworkTitle={selectedArtwork.title}
                    artworkDate={selectedArtwork.date}
                    artworkImgUrl={selectedArtwork.imgUrl}
                />
            )}
        </div>
    );
};

export default Artworks;