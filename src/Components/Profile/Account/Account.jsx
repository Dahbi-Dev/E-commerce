import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaLock, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Account.css'
const Account = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [error, setError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const api = process.env.REACT_APP_API_URL;


  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${api}/api/user/me`, {
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      setUser(userData);
      setEditedUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user data. Please try again later.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedUserData = { ...editedUser };
      if (newPassword) {
        updatedUserData.currentPassword = currentPassword;
        updatedUserData.newPassword = newPassword;
      }

      const response = await fetch(`${api}/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify(updatedUserData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      setError(null);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message || 'Failed to update user data. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      const ordersResponse = await fetch(`${api}/api/orders/user/${user._id}`, {
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
        },
      });

      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch user orders');
      }

      const ordersData = await ordersResponse.json();

      for (const order of ordersData) {
        const deleteResponse = await fetch(`${api}/delete-order/${order._id}`, {
          method: 'DELETE',
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
          },
        });
        if (!deleteResponse.ok) {
          throw new Error('Failed to delete an order');
        }
      }

      const response = await fetch(`${api}/api/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      localStorage.removeItem('auth-token');
      navigate('/');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return (
      <div className="loading-spinner">
        <p>Loading...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="wrap-account">
        <h2>Account Information</h2>
        <div className="account-info">
          <div className="info-item">
            <FaUser className="icon" />
            {isEditing ? (
              <input type="text" name="name" value={editedUser.name || ''} onChange={handleChange} placeholder="Name" />
            ) : (
              <span>{user.name}</span>
            )}
          </div>
          <div className="info-item">
            <FaEnvelope className="icon" />
            {isEditing ? (
              <input type="email" name="email" value={editedUser.email || ''} onChange={handleChange} placeholder="Email" />
            ) : (
              <span>{user.email}</span>
            )}
          </div>
          <div className="info-item">
            <FaCalendar className="icon" />
            {isEditing ? (
              <input
                type="date"
                name="date"
                value={editedUser.date ? new Date(editedUser.date).toISOString().split('T')[0] : ''}
                onChange={handleChange}
              />
            ) : (
              <span>{user.date ? new Date(user.date).toLocaleDateString() : 'Not set'}</span>
            )}
          </div>
          {isEditing && (
            <>
              <div className="info-item">
                <FaLock className="icon" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                />
              </div>
              <div className="info-item">
                <FaLock className="icon" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (optional)"
                />
              </div>
            </>
          )}
        </div>
        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>
            <FaSave /> Save
          </button>
        ) : (
          <button className="edit-btn" onClick={handleEdit}>
            <FaEdit /> Edit
          </button>
        )}
        <button className="delete-btn" onClick={handleDeleteClick}>
          <FaTrash /> Delete Account
        </button>
        {confirmDelete && (
          <div className="confirmation-window">
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <button className="confirm-btn" onClick={handleConfirmDelete}>Yes, delete my account</button>
            <button className="cancel-btn" onClick={handleCancelDelete}>Cancel</button>
          </div>
        )}
        {loading && (
          <div className="loading-spinner">
            <p>Deleting your account and orders...</p>
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
