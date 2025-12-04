import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Card from '../components/Card';
import Button from '../components/Button';
import './ProfilePage.css';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  allergies?: string[];
  currentMedications?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    allergies: '',
    currentMedications: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/patient/profile');
      setProfile(response.data.profile);
      populateForm(response.data.profile);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const populateForm = (profileData: Profile) => {
    setFormData({
      firstName: profileData.firstName || '',
      lastName: profileData.lastName || '',
      dateOfBirth: profileData.dateOfBirth || '',
      allergies: profileData.allergies?.join(', ') || '',
      currentMedications: profileData.currentMedications?.join(', ') || '',
      emergencyContactName: profileData.emergencyContact?.name || '',
      emergencyContactPhone: profileData.emergencyContact?.phone || '',
      emergencyContactRelationship: profileData.emergencyContact?.relationship || ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth || undefined,
        allergies: formData.allergies 
          ? formData.allergies.split(',').map(a => a.trim()).filter(Boolean)
          : [],
        currentMedications: formData.currentMedications
          ? formData.currentMedications.split(',').map(m => m.trim()).filter(Boolean)
          : [],
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        }
      };

      await axios.put('/patient/profile', updateData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      populateForm(profile);
    }
    setIsEditing(false);
    setError('');
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loader"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and health details</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-container">
        <Card title="Personal Information">
          <form onSubmit={handleSubmit}>
            <div className="profile-section">
              <h3>Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="form-input"
                />
                <small className="field-note">Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>
            </div>

            <div className="profile-section">
              <h3>Medical Information</h3>
              <div className="form-group">
                <label htmlFor="allergies">Allergies</label>
                <textarea
                  id="allergies"
                  name="allergies"
                  placeholder="Enter allergies separated by commas"
                  value={formData.allergies}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-textarea"
                  rows={3}
                />
                <small className="field-note">Separate multiple allergies with commas</small>
              </div>

              <div className="form-group">
                <label htmlFor="currentMedications">Current Medications</label>
                <textarea
                  id="currentMedications"
                  name="currentMedications"
                  placeholder="Enter medications separated by commas"
                  value={formData.currentMedications}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-textarea"
                  rows={3}
                />
                <small className="field-note">Separate multiple medications with commas</small>
              </div>
            </div>

            <div className="profile-section">
              <h3>Emergency Contact</h3>
              <div className="form-group">
                <label htmlFor="emergencyContactName">Name</label>
                <input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  type="text"
                  placeholder="Emergency contact name"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emergencyContactPhone">Phone</label>
                  <input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emergencyContactRelationship">Relationship</label>
                  <input
                    id="emergencyContactRelationship"
                    name="emergencyContactRelationship"
                    type="text"
                    placeholder="e.g., Spouse, Parent"
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <Button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                  variant="primary"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button type="submit" variant="success" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleCancel}
                    variant="secondary"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
