import { Routes, Route } from 'react-router-dom';

import Private     from '../components/Private';
import Admin       from '../components/Admin';
import Login       from '../pages/Login';
import Home        from '../pages/Home';
import Usuarios    from '../pages/Usuarios';
import NovoUsuario from '../pages/NovoUsuario';
import Grupos      from '../pages/Grupos';
import Companhias  from '../pages/Companhias';
import Orgaos      from '../pages/Orgaos';
import Cargos      from '../pages/Cargos';
import Pessoas     from '../pages/Pessoas';
import Erro        from '../pages/Erro';
import Sair        from '../pages/Sair';

function RoutesApp(){
  return(
    <Routes>
      <Route path='/'            element={ <Login/> } />
      <Route path='/Home'        element={ <Private><Home/></Private> } />
      <Route path='/Usuarios'    element={ <Admin><Usuarios/></Admin> } />
      <Route path='/NovoUsuario' element={ <NovoUsuario/> } />
      <Route path='/Grupos'      element={ <Private><Grupos/></Private> } />
      <Route path='/Companhias'  element={ <Private><Companhias/></Private> } />
      <Route path='/Orgaos'      element={ <Private><Orgaos/></Private> } />
      <Route path='/Cargos'      element={ <Private><Cargos/></Private> } />
      <Route path='/Pessoas'     element={ <Private><Pessoas/></Private> } />
      <Route path='/Sair'        element={ <Sair/> } />

      <Route path='*'            element={ <Erro/>} />
    </Routes>
  );
}

export default RoutesApp;