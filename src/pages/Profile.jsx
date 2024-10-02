import React, { useEffect, useState } from 'react';
import { useUser } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Profile.module.css';

const Profile = () => {
  const { getProfile, updateProfile, logout } = useUser();
  const [userProfile, setUserProfile] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    profileImage: ''
  });
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfile();
      if (!profile) {
        setMessage('Error al obtener el perfil. Por favor, inicie sesión nuevamente.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setUserProfile(profile);
        setImagePreview(profile.profileImage || 'default-profile.png'); // Imagen por defecto
      }
    };
    fetchProfile();
  }, [getProfile, navigate]);

  const handleInputChange = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result); // Previsualización de la imagen
      reader.readAsDataURL(file);
      setUserProfile({ ...userProfile, profileImage: reader.result });
    }
  };

  const handleUpdateProfile = async () => {
    const success = await updateProfile(userProfile);
    setMessage(success ? 'Perfil actualizado correctamente' : 'Error al actualizar el perfil');
  };

  return (
    <div className={styles['profile-container']}>
      {message && <p className={styles['message']}>{message}</p>}
      <div className={styles['profile-card']}>
        <div className={styles['profile-image-container']}>
          <img 
            src={imagePreview} 
            alt="Profile" 
            className={styles['profile-image']} 
            onError={(e) => { e.target.src = 'default-profile.png'; }} // Imagen por defecto
          />
          <div className={styles['image-overlay']}>
            <label htmlFor="file-input">
              <i className="fas fa-pencil-alt" style={{ fontSize: '1.5rem', color: 'white' }}></i> 
            </label>
            <input 
              id="file-input" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className={styles['image-input']}
            />
          </div>
        </div>
        <div className={styles['profile-info']}>
          <h2 className={styles['profile-title']}>Mi Perfil</h2>

          {/* Email */}
          <label className={styles['profile-label']}>Email</label>
          <input type="email" name="email" value={userProfile.email} disabled className={styles['profile-input']} />

          {/* Nombre */}
          <label className={styles['profile-label']}>Nombre</label>
          <input type="text" name="name" value={userProfile.name} onChange={handleInputChange} className={styles['profile-input']} />
          
          {/* Teléfono */}
          <label className={styles['profile-label']}>Teléfono</label>
          <input type="text" name="phone" value={userProfile.phone} onChange={handleInputChange} className={styles['profile-input']} />
          
          {/* Dirección */}
          <label className={styles['profile-label']}>Dirección</label>
          <input type="text" name="address" value={userProfile.address} onChange={handleInputChange} className={styles['profile-input']} />
          
          <button className={styles['update-button']} onClick={handleUpdateProfile}>Actualizar Perfil</button>
          <button className={styles['logout-button']} onClick={logout}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

