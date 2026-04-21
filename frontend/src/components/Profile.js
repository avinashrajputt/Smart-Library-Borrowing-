import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { authAPI } from '../utils/api';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      setProfile(response.data.user);
      setError('');
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="loading">No profile data</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.firstName.charAt(0)}
            {profile.lastName.charAt(0)}
          </div>
          <h1>{profile.firstName} {profile.lastName}</h1>
          <p className="username">@{profile.username}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="profile-details">
          <div className="detail-item">
            <label>Email:</label>
            <p>{profile.email}</p>
          </div>

          <div className="detail-item">
            <label>Username:</label>
            <p>{profile.username}</p>
          </div>

          <div className="detail-item">
            <label>Total Books Borrowed:</label>
            <p>{profile.totalBorrowed}</p>
          </div>

          <div className="detail-item">
            <label>Total Books Returned:</label>
            <p>{profile.totalReturned}</p>
          </div>

          <div className="detail-item">
            <label>Current Debt:</label>
            <p className={profile.currentDebt > 0 ? 'debt' : 'clear'}>
              ${profile.currentDebt.toFixed(2)}
            </p>
          </div>

          <div className="detail-item">
            <label>Member Since:</label>
            <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
