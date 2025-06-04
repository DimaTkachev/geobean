import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts'; 

interface ProfileOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileOptionsModal: React.FC<ProfileOptionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  if (!isOpen) {
    return null;
  }

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogoutClick = () => {
    logout(); 
    onClose(); 
    navigate('/'); 
  };

  return (
    <div
      style={{
        position: 'absolute', 
        top: 'calc(100% + 10px)', 
        right: 0,
        backgroundColor: '#ffe2d0', 
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
          onClick={() => handleNavigation('/catalog')} 
        >
          Каталог зерен
        </li>
        <li
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            color: '#3c1f0c',
          }}
          onClick={() => handleNavigation('/inventory')} 
        >
          Инвентарь кофейни
        </li>
        <li
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            color: '#3c1f0c',
          }}
          onClick={() => handleNavigation('/guest-access')} 
        >
          Гостевой доступ
        </li>
        <li
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            color: '#3c1f0c',
            borderTop: '1px solid #d4a88c', 
            marginTop: '5px',
            paddingTop: '15px',
          }}
          onClick={handleLogoutClick} 
        >
          Выйти
        </li>
      </ul>
    </div>
  );
}; 