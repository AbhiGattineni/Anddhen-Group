import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, Spinner, Alert, Container } from 'react-bootstrap';

export default function HousePricePredictor() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Initialize all form values as numbers
  const [form, setForm] = useState({
    crim: 0.05,
    zn: 0,
    indus: 5,
    chas: 0,
    nox: 1,
    rm: 8,
    age: 5,
    dis: 3,
    rad: 1,
    tax: 300,
    ptratio: 15,
    b: 390,
    lstat: 5,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState(null);

  const handleInputChange = e => {
    const { name, value } = e.target;
    // Ensure empty values are converted to 0 instead of empty string
    const numericValue = value === '' ? 0 : parseFloat(value);
    setForm(prev => ({ ...prev, [name]: numericValue }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setDebug(null);

    try {
      // Create a new object with all values explicitly converted to numbers
      const numericForm = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, parseFloat(value) || 0])
      );

      // Validate all values are numbers
      for (const [key, value] of Object.entries(numericForm)) {
        if (typeof value !== 'number' || isNaN(value)) {
          throw new Error(`${key} must be a valid number`);
        }
      }

      // Log the request payload for debugging
      console.log('Request payload:', numericForm);
      console.log(
        'Request payload types:',
        Object.entries(numericForm).reduce((acc, [key, value]) => {
          acc[key] = typeof value;
          return acc;
        }, {})
      );

      const res = await fetch(`${API_BASE_URL}/api/predict-house-price/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(numericForm),
      });

      const data = await res.json();
      console.log('Response:', data);

      if (res.ok) {
        setResult(data.predicted_price);
      } else {
        setError(data.error || 'Prediction failed');
        setDebug({
          requestPayload: numericForm,
          response: data,
        });
      }
    } catch (err) {
      setError(err.message || 'Network error');
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border-0">
            <Card.Body>
              <Card.Title className="text-center mb-4">House Price Predictor</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Row>
                  {[
                    { label: 'Crime Rate (per capita)', name: 'crim', min: 0 },
                    {
                      label: 'Residential Land (>% zoned)',
                      name: 'zn',
                      min: 0,
                    },
                    { label: 'Industrial Area (%)', name: 'indus', min: 0 },
                    {
                      label: 'Charles River (1=yes, 0=no)',
                      name: 'chas',
                      min: 0,
                      max: 1,
                    },
                    {
                      label: 'Nitric Oxide (NOX) Concentration',
                      name: 'nox',
                      min: 0,
                    },
                    { label: 'Average Rooms per Dwelling', name: 'rm', min: 0 },
                    { label: 'House Age (%)', name: 'age', min: 0, max: 100 },
                    {
                      label: 'Distance to Employment Centers',
                      name: 'dis',
                      min: 0,
                    },
                    {
                      label: 'Accessibility to Highways (RAD)',
                      name: 'rad',
                      min: 0,
                    },
                    { label: 'Property Tax Rate', name: 'tax', min: 0 },
                    {
                      label: 'Pupil-Teacher Ratio (PTRATIO)',
                      name: 'ptratio',
                      min: 0,
                    },
                    { label: 'Black Population Index (B)', name: 'b', min: 0 },
                    {
                      label: 'Lower Income Population (%) (LSTAT)',
                      name: 'lstat',
                      min: 0,
                      max: 100,
                    },
                  ].map(field => (
                    <Col xs={6} className="mb-2" key={field.name}>
                      <Form.Group>
                        <Form.Label>{field.label}</Form.Label>
                        <Form.Control
                          type="number"
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleInputChange}
                          required
                          step="any"
                          min={field.min}
                          max={field.max}
                        />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
                {error && (
                  <Alert variant="danger" className="mt-2">
                    {error}
                    {debug && (
                      <div className="mt-2">
                        <small>Debug Info:</small>
                        <pre className="mt-1" style={{ fontSize: '0.8em' }}>
                          {JSON.stringify(debug, null, 2)}
                        </pre>
                      </div>
                    )}
                  </Alert>
                )}
                {result !== null && (
                  <Alert variant="success" className="mt-2">
                    Predicted Price: <b>{result}</b>
                  </Alert>
                )}
                <div className="d-flex justify-content-end mt-3">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Predict'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
