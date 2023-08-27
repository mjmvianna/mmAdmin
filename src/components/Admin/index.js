import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth';

export default function Admin({ children }){
  const { signed, userAdmin, loading } = useContext(AuthContext);
  
  if(loading){
    return(
      <div></div>
    );
  }
  
  if(!userAdmin){
    return <Navigate to="/" />;
  }
  
  return children;
}
