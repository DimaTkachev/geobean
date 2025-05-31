import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts'; // Import useAuth

interface ProfileOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileOptionsModal: React.FC<ProfileOptionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Use the useAuth hook

  if (!isOpen) {
    return null;
  }

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogoutClick = () => {
    logout(); // Call the logout function
    onClose(); // Close the modal
    navigate('/'); // Navigate to the home page after logout
  };

  return (
    <div
      style={{
        position: 'absolute', // Position relative to the header or a container
        top: 'calc(100% + 10px)', // Position below the email/profile name
        right: 0,
        backgroundColor: '#ffe2d0', // Light brown background
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        padding: '10px 0',
        zIndex: 1000,
        minWidth: '200px',
      }}
    >
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            color: '#3c1f0c',
          }}
          onClick={() => handleNavigation('/catalog')} // Replace with actual path
        >
          Каталог зерен
        </li>
        <li
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            color: '#3c1f0c',
          }}
          onClick={() => handleNavigation('/inventory')} // Replace with actual path
        >
          Инвентарь кофейни
        </li>
        <li
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            color: '#3c1f0c',
          }}
          onClick={() => handleNavigation('/guest-access')} // Replace with actual path
        >
          Гостевой доступ
        </li>
        <li
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            color: '#3c1f0c',
            borderTop: '1px solid #d4a88c', // Separator line
            marginTop: '5px',
            paddingTop: '15px',
          }}
          onClick={handleLogoutClick} // Call the new handler
        >
          Выйти
        </li>
      </ul>
    </div>
  );
}; 