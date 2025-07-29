// This file is now replaced by LoginPage.tsx
// The main route "/" now points to LoginPage component

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
