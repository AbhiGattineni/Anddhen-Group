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
  ListGroup,
} from 'react-bootstrap';
import { useMutation } from 'react-query';
import FinanceAnalytics from './FinanceAnalytics';
import { toast, Toaster } from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FinanceDataUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [persistData, setPersistData] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [fileInputKey, setFileInputKey] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: async files => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('statement', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/finance/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload response:', data);
      return data;
    },
    onSuccess: data => {
      console.log('Success handler data:', data);

      // Update upload history with the new upload
      const newUpload = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'success',
        message: data.message,
        fileResults: data.file_results,
        totalCount: data.total_count,
        transactions: data.transactions,
      };
      setUploadHistory(prev => [newUpload, ...prev]);

      // Update current transactions if available
      if (data.transactions && Array.isArray(data.transactions)) {
        console.log('Setting transactions:', data.transactions);
        setCurrentTransactions(data.transactions);
      }

      // Clear selected files
      setSelectedFiles([]);
      setFileInputKey(Date.now());

      // Show success message
      toast.success(
        `Files uploaded successfully! Processed ${data.total_count || 0} transactions.`
      );
    },
    onError: error => {
      console.error('Upload error:', error);

      // Update upload history with the failed upload
      const newUpload = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'error',
        message: error.message,
      };
      setUploadHistory(prev => [newUpload, ...prev]);

      // Show error message
      toast.error(error.message || 'Upload failed');
    },
  });

  const handleFileChange = event => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(
      file => file.type === 'text/csv' || file.type === 'application/pdf'
    );

    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Only CSV and PDF files are allowed.');
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      validFiles.forEach(file => {
        newProgress[file.name] = 'pending';
      });
      return newProgress;
    });
  };

  const removeFile = filename => {
    setSelectedFiles(prev => prev.filter(file => file.name !== filename));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[filename];
      return newProgress;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    try {
      await uploadMutation.mutateAsync(selectedFiles);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const getUploadStatus = filename => {
    const status = uploadProgress[filename];
    switch (status) {
      case 'pending':
        return <span className="text-muted">Pending</span>;
      case 'uploading':
        return (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="me-2"
          />
        );
      case 'success':
        return <span className="text-success">Completed</span>;
      case 'error':
        return <span className="text-danger">Error</span>;
      default:
        return null;
    }
  };

  return (
    <div className="finance-data-upload">
      <Toaster position="top-right" />
      <Card>
        <CardHeader>
          <h4 className="mb-0">Finance Data Management</h4>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={4}>
              <Card className="mb-4">
                <CardHeader>
                  <h5 className="mb-0">Upload Statements</h5>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Files (CSV or PDF)</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        accept=".csv,.pdf"
                        multiple
                        key={fileInputKey}
                      />
                    </Form.Group>

                    {selectedFiles.length > 0 && (
                      <ListGroup className="mb-3">
                        {selectedFiles.map(file => (
                          <ListGroup.Item
                            key={file.name}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <div>
                              {file.name}
                              <div className="small">{getUploadStatus(file.name)}</div>
                            </div>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-danger"
                              onClick={() => removeFile(file.name)}
                            >
                              Remove
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}

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
                      disabled={selectedFiles.length === 0 || uploadMutation.isPending}
                    >
                      {uploadMutation.isPending ? (
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
                        'Upload All'
                      )}
                    </Button>
                  </Form>

                  {uploadMutation.isError && (
                    <Alert variant="danger" className="mt-3">
                      Error uploading files: {uploadMutation.error.message}
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
                          <h6>{upload.timestamp}</h6>
                          <p className="mb-1">
                            {upload.status === 'success' ? 'Upload successful' : 'Upload failed'}
                          </p>
                          {upload.fileResults && (
                            <div className="mt-2">
                              <h6 className="small">File Results:</h6>
                              <ul className="list-unstyled small">
                                {upload.fileResults.map(result => (
                                  <li
                                    key={result.filename}
                                    className={
                                      result.status === 'error' ? 'text-danger' : 'text-success'
                                    }
                                  >
                                    {result.filename}:{' '}
                                    {result.status === 'error'
                                      ? result.error
                                      : `${result.count} transactions`}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
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
                <Alert variant="info">
                  {uploadMutation.isPending
                    ? 'Processing your files...'
                    : 'Upload files to see analytics'}
                </Alert>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default FinanceDataUpload;
