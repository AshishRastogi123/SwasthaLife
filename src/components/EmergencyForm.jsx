import React, { useState } from 'react';
import './EmergencyForm.css';

const EmergencyForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        emergency: '',
        symptoms: '',
        preferredTime: ''
    });

    React.useEffect(() => {
        // Add padding to account for fixed navbar when scrolling to this section
        const section = document.getElementById('emergency-section');
        if (section) {
            section.style.scrollMarginTop = '80px';
        }
    }, []);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send this data to your backend
        console.log('Emergency Form Data:', formData);
        setIsSubmitted(true);
        
        // Reset form after 3 seconds of showing success message
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                phone: '',
                emergency: '',
                symptoms: '',
                preferredTime: ''
            });
        }, 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <section id="emergency-section" className="emergency-section" style={
            { 
                borderRadius: '18px'
             }
            }>
            <div className="emergency-container">
                <div className="emergency-header">
                    <h2>🚨 Emergency Appointment</h2>
                    <p>Quick Response for Urgent Medical Care</p>
                </div>
                
                {isSubmitted ? (
                    <div className="success-message">
                        <h3>✅ Emergency Request Submitted!</h3>
                        <p>We will contact you immediately on your provided phone number.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="emergency-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name*</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number*</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="emergency">Emergency Type*</label>
                            <select
                                id="emergency"
                                name="emergency"
                                value={formData.emergency}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select emergency type</option>
                                <option value="accident">Accident & Trauma</option>
                                <option value="cardiac">Cardiac Emergency</option>
                                <option value="respiratory">Breathing Difficulty</option>
                                <option value="pediatric">Pediatric Emergency</option>
                                <option value="other">Other Emergency</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="symptoms">Brief Description of Symptoms*</label>
                            <textarea
                                id="symptoms"
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleChange}
                                required
                                placeholder="Describe your symptoms or emergency situation"
                                rows="3"
                            ></textarea>
                        </div>

                        

                        <button type="submit" className="submit-btn">
                            Request Emergency Appointment
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default EmergencyForm;