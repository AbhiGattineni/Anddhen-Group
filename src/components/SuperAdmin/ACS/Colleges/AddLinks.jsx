import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import InputField from 'src/components/organisms/InputField';
import ConfirmationDialog from 'src/components/organisms/Modal/ConfirmationDialog';
import { Search } from 'src/components/organisms/Search';
import Toast from 'src/components/organisms/Toast';
import { useDeleteData } from 'src/react-query/useFetchApis';
import { useUpdateData, useAddData } from 'src/react-query/useFetchApis';
import { useFetchData } from 'src/react-query/useFetchApis';
import useAuthStore from 'src/services/store/globalStore';

export const AddLinks = () => {
  const queryClient = useQueryClient();
  const [selectedcollege, setSelectedcollege] = useState(null);
  const [collegeList, setCollegeList] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [disablebutton, setDisableButton] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedLink, setEditedLink] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newRow, setNewRow] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    color: undefined,
  });
  const [formData, setFormData] = useState({
    label: '',
    link: '',
  });

  const collegesList = useAuthStore(state => state.collegesList);
  console.log(disablebutton);

  useEffect(() => {
    const collegeNames = collegesList.map(college => ({
      value: college.id,
      label: college.college_name,
    }));
    setCollegeList(collegeNames);
  }, [collegesList]);

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(value => value !== '');
    const hasErrors = Object.values(fieldErrors).some(error => error);
    setDisableButton(!allFieldsFilled || hasErrors);
  }, [formData, fieldErrors]);

  const handleChange = (field, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const { data = [] } = useFetchData('links', `/college_details/`);

  useEffect(() => {
    if (selectedcollege && selectedcollege.value) {
      const filteredLinks = data.filter(link => link.college === selectedcollege.value);
      setSelectedLinks(filteredLinks);
    }
    if (selectedLinks) {
      setInputDisabled(true);
    }
  }, [data, selectedcollege, selectedLinks]);

  const handleFieldError = (fieldName, error) => {
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Implement form submission logic here
  };

  const { mutate: updateLinks, isLoading: editLoading } = useUpdateData(
    'links',
    `/college_details/${editedLink?.id}/update/`
  );

  const { mutate: addLink, isLoading: addLoading } = useAddData(
    'links',
    `/college_details/create/`
  );

  const handleEdit = async index => {
    setEditingIndex(index);
    setEditedLink({ ...selectedLinks[index] });
    setFormData({
      label: selectedLinks[index].label,
      link: selectedLinks[index].link,
    });
    setInputDisabled(false);
  };

  const handleSave = async () => {
    try {
      if (newRow) {
        // Adding new link
        const newData = {
          college: selectedcollege.value,
          college_name: selectedcollege.label,
          ...newRow,
        };

        await addLink(newData, {
          onSuccess: () => {
            queryClient.invalidateQueries('links');
            setSelectedLinks(prevLinks => [...prevLinks, formData]);
            setNewRow(null);
            setToast({
              show: true,
              message: 'Link added successfully!',
              color: '#82DD55',
            });
            setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
          },
          onError: error => {
            console.error('An error occurred:', error);
            setToast({
              show: true,
              message: 'Something went wrong!',
              color: '#E23636',
            });
            setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
          },
        });
      } else {
        // Updating existing link
        const updatedData = {
          college: editedLink.college,
          college_name: editedLink.college_name,
          ...formData,
        };
        await updateLinks(updatedData, {
          onSuccess: () => {
            queryClient.invalidateQueries('links');
            const updatedLinks = selectedLinks.map((link, index) =>
              index === editingIndex ? { ...formData, id: editedLink.id } : link
            );
            setSelectedLinks(updatedLinks);
            setEditingIndex(null);
            setInputDisabled(true);
            setToast({
              show: true,
              message: 'Link updated successfully!',
              color: '#82DD55',
            });
            setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
          },
          onError: error => {
            console.error('An error occurred:', error);
            setToast({
              show: true,
              message: 'Something went wrong!',
              color: '#E23636',
            });
            setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
          },
        });
      }
    } catch (error) {
      console.error('Operation error:', error.message);
      setToast({
        show: true,
        message: `Operation failed: ${error.message}`,
        color: '#E23636',
      });
      setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
    }
  };

  const handleCancel = () => {
    if (newRow) {
      setNewRow(null);
    } else {
      setEditingIndex(null);
      setInputDisabled(true);
      setFormData({
        label: editedLink?.label || '',
        link: editedLink?.link || '',
      });
    }
  };

  // const { mutate: deleteLink }
  const { mutate: deleteLink, isLoading: deleteLoading } = useDeleteData(
    'links',
    `/college_details/${deleteIndex}/delete/`
  );

  const handleDeleteLink = e => {
    e.preventDefault();
    deleteLink(null, {
      onSuccess: () => {
        queryClient.invalidateQueries('links');
        setDeleteIndex(null);
        setShowConfirmation(false);
        setToast({
          show: true,
          message: 'Link deleted successfully!',
          color: '#82DD55',
        });
        setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
      },
      onError: error => {
        console.error('An error occurred:', error);
        setToast({
          show: true,
          message: 'Something went wrong!',
          color: '#E23636',
        });
        setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
      },
    });
  };

  const handleDelete = async index => {
    setShowConfirmation(true);
    const linkId = selectedLinks[index].id;
    setDeleteIndex(linkId);
  };

  const handleAddRow = () => {
    setNewRow({
      label: '',
      link: '',
    });
    setInputDisabled(false);
  };

  return (
    <div className="container py-3 border">
      <Search
        selectedOption={selectedcollege}
        setSelectedOption={setSelectedcollege}
        placeholder={'search colleges ...'}
        options={collegeList}
        isMulti={false}
      />
      <form onSubmit={handleSubmit}>
        <div className="my-3">
          <h5>College Links Details</h5>
          <div className="underline"></div>
          {selectedcollege ? (
            <div className="">
              {selectedLinks && (
                <>
                  {selectedLinks.map((link, index) => (
                    <div className="row my-2" key={link.id}>
                      <InputField
                        disabled={inputDisabled || editingIndex !== index}
                        name="label"
                        label="Label"
                        type="text"
                        className="col-12 col-md"
                        value={index === editingIndex ? formData.label : link.label}
                        onChange={e => handleChange('label', e.target.value)}
                        setError={error => handleFieldError('label', error)}
                      />
                      <InputField
                        disabled={inputDisabled || editingIndex !== index}
                        name="link"
                        label="Link"
                        type="url"
                        className="col-12 col-md"
                        value={index === editingIndex ? formData.link : link.link}
                        onChange={e => handleChange('link', e.target.value)}
                        setError={error => handleFieldError('link', error)}
                      />
                      <div className="col-12 col-md-auto d-flex align-items-end justify-content-md-start justify-content-between mt-2 mt-md-0">
                        {editingIndex === index ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-success mx-1"
                              onClick={handleSave}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary mx-1"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn btn-info mx-1"
                              onClick={() => handleEdit(index)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger mx-1"
                              onClick={() => handleDelete(index)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {newRow && (
                    <div className="row my-2">
                      <InputField
                        name="label"
                        label="Label"
                        type="text"
                        className="col-12 col-md"
                        value={newRow.label}
                        onChange={e => setNewRow({ ...newRow, label: e.target.value })}
                        setError={error => handleFieldError('label', error)}
                      />
                      <InputField
                        name="link"
                        label="Link"
                        type="url"
                        className="col-12 col-md"
                        value={newRow.link}
                        onChange={e => setNewRow({ ...newRow, link: e.target.value })}
                        setError={error => handleFieldError('link', error)}
                      />
                      <div className="col-12 col-md-auto d-flex align-items-end justify-content-md-start justify-content-between mt-2 mt-md-0">
                        <button type="button" className="btn btn-success mx-1" onClick={handleSave}>
                          {addLoading || editLoading ? 'loading...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary mx-1"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
              <button
                type="button"
                className="btn btn-warning shadow px-5 mt-3"
                onClick={handleAddRow}
              >
                Add link
              </button>
            </div>
          ) : (
            <div className="">
              <p>Select college to add links!</p>
            </div>
          )}
        </div>
      </form>
      <Toast
        show={toast.show}
        message={toast.message}
        color={toast.color}
        onClose={() => setToast({ show: false, message: '', color: undefined })}
      />
      <ConfirmationDialog
        title="Confirmation"
        show={showConfirmation}
        isLoading={deleteLoading}
        message="Are you sure you want to delete this college link?"
        onConfirm={handleDeleteLink}
        onCancel={() => setShowConfirmation(false)}
      />
    </div>
  );
};
