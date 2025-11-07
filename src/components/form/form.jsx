import React, { useState } from 'react';

const SymptomForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    symptoms: [{ symptom: '', details: '' }]
  });

  const symptoms = [
    'Fever',
    'Headache',
    'Cough',
    'Fatigue',
    'Body Pain',
    'Sore Throat',
    'Nausea',
    'Others'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSymptomChange = (index, field, value) => {
    const newSymptoms = [...formData.symptoms];
    newSymptoms[index] = {
      ...newSymptoms[index],
      [field]: value
    };
    setFormData({
      ...formData,
      symptoms: newSymptoms
    });
  };

  const addSymptom = () => {
    setFormData({
      ...formData,
      symptoms: [...formData.symptoms, { symptom: '', details: '' }]
    });
  };

  const removeSymptom = (index) => {
    const newSymptoms = formData.symptoms.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      symptoms: newSymptoms
    });
  };

  const getSymptomDetails = (symptom) => {
    switch (symptom) {
      case 'Fever':
        return (
          <select
            className="form-select"
            onChange={(e) => handleSymptomChange(index, 'details', e.target.value)}
          >
            <option value="">Select fever range</option>
            <option value="mild">Mild (98.7°F - 100.4°F)</option>
            <option value="moderate">Moderate (100.4°F - 102.2°F)</option>
            <option value="high">High (above 102.2°F)</option>
          </select>
        );
      default:
        return (
          <input
            type="text"
            className="form-control"
            placeholder="Provide more details"
            onChange={(e) => handleSymptomChange(index, 'details', e.target.value)}
          />
        );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add your form submission logic here
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Health Symptom Form</h2>
        
        {/* Name Field */}
        <div className="mb-4">
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        {/* Gender Field */}
        <div className="mb-4">
          <label className="block mb-2">Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Symptoms Section */}
        <div className="mb-4">
          <label className="block mb-2">Symptoms:</label>
          {formData.symptoms.map((symptomObj, index) => (
            <div key={index} className="mb-3 p-3 border rounded">
              <div className="flex items-center gap-2">
                <select
                  value={symptomObj.symptom}
                  onChange={(e) => handleSymptomChange(index, 'symptom', e.target.value)}
                  className="form-select mb-2"
                  required
                >
                  <option value="">Select Symptom</option>
                  {symptoms.map((symptom) => (
                    <option key={symptom} value={symptom}>
                      {symptom}
                    </option>
                  ))}
                </select>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeSymptom(index)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                )}
              </div>
              {symptomObj.symptom && getSymptomDetails(symptomObj.symptom)}
            </div>
          ))}
          <button
            type="button"
            onClick={addSymptom}
            className="btn btn-secondary"
          >
            Add Another Symptom
          </button>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SymptomForm;
