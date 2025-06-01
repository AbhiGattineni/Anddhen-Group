import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Form,
  Alert,
  Spinner,
  Row,
  Col,
} from 'react-bootstrap';
import { useMutation } from 'react-query';
import FinanceAnalytics from './FinanceAnalytics';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FinanceDataUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [persistData, setPersistData] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [currentTransactions, setCurrentTransactions] = useState([]);

  const uploadMutation = useMutation(
    async formData => {
      console.log('Selected file:', selectedFile);
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch(`${API_BASE_URL}/api/finance/upload/`, {
        method: 'POST',
        body: formData,
      });
      return response.json();
    },
    {
      onSuccess: data => {
        console.log('Upload successful:', data);
        if (Array.isArray(data.transactions)) {
          setCurrentTransactions(data.transactions);
          setUploadHistory(prev => [
            {
              id: Date.now(),
              filename: selectedFile.name,
              date: new Date().toISOString(),
              count: data.count,
              transactions: data.transactions,
            },
            ...prev,
          ]);
        } else {
          console.error('Invalid transactions data:', data);
        }
        setSelectedFile(null);
      },
      onError: error => {
        console.error('Upload error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      },
    }
  );

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'text/csv' || file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        alert('Please select a CSV or PDF file');
      }
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('statement', selectedFile);
    formData.append('persist', persistData);
    formData.append('file_type', selectedFile.name.endsWith('.pdf') ? 'pdf' : 'csv');

    uploadMutation.mutate(formData);
  };

  return (
    <div className="finance-data-upload">
      <Card>
        <CardHeader>
          <h4 className="mb-0">Finance Data Management</h4>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={4}>
              <Card className="mb-4">
                <CardHeader>
                  <h5 className="mb-0">Upload Statement</h5>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select File (CSV or PDF)</Form.Label>
                      <Form.Control type="file" onChange={handleFileChange} accept=".csv,.pdf" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Save data for future use"
                        checked={persistData}
                        onChange={e => setPersistData(e.target.checked)}
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={!selectedFile || uploadMutation.isLoading}
                    >
                      {uploadMutation.isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Uploading...
                        </>
                      ) : (
                        'Upload'
                      )}
                    </Button>
                  </Form>

                  {uploadMutation.isError && (
                    <Alert variant="danger" className="mt-3">
                      Error uploading file: {uploadMutation.error.message}
                    </Alert>
                  )}
                </CardBody>
              </Card>

              {uploadHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <h5 className="mb-0">Upload History</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="upload-history">
                      {uploadHistory.map(upload => (
                        <div key={upload.id} className="mb-3">
                          <h6>{upload.filename}</h6>
                          <p className="mb-1">Uploaded: {new Date(upload.date).toLocaleString()}</p>
                          <p className="mb-0">Transactions: {upload.count}</p>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => setCurrentTransactions(upload.transactions)}
                          >
                            View Analysis
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}
            </Col>
            <Col md={8}>
              {Array.isArray(currentTransactions) && currentTransactions.length > 0 ? (
                <FinanceAnalytics transactions={currentTransactions} />
              ) : (
                <Alert variant="info">Upload a file to see analytics</Alert>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default FinanceDataUpload;
