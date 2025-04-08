import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Card, Row, Col, Alert } from 'react-bootstrap';
import { getCategories, Category } from '../utils/api';

interface CategoriesModalProps {
  show: boolean;
  handleClose: () => void;
  artworkId: string;
  artworkTitle: string;
  artworkDate: string;
  artworkImgUrl: string;
}

const CategoriesModal: React.FC<CategoriesModalProps> = ({ show, handleClose, artworkId, artworkTitle, artworkDate, artworkImgUrl }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasCategories, setHasCategories] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      setLoading(true);
      setCategories([]);
      getCategories(artworkId)
        .then((data) => {
          if (data && data.length > 0) {
            setCategories(data);
            setHasCategories(true);
        } else {
            setHasCategories(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching categories: ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [show, artworkId]);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={artworkImgUrl} alt={artworkTitle} style={{ width: '50px', height: '50px', marginRight: '10px', objectFit: 'cover' }} />
          <div>
            <h5>{artworkTitle}</h5>
            <p style={{ margin: 0 }}>{artworkDate}</p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <hr />
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : hasCategories ? (
          <Row>
            {categories.map((category, index) => (
              <Col md={4} key={index} className="mb-3">
                <Card>
                  <Card.Img variant="top" src={category.imgUrl} alt={category.name} />
                  <Card.Body>
                    <Card.Title>{category.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
            <Alert variant="danger" className="mx-auto my-3" style={{ minWidth: '45%' }}>
                No categories.
            </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoriesModal;