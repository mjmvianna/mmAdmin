import './header.css';

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { BiExit } from 'react-icons/bi';

import { AuthContext } from '../../contexts/auth';

function Header() {
  const { signed, userAdmin, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [ exibeMenuFlutuante, setExibeMenuFlutuante ] = useState(false);
  
  async function handleHome() {
    setExibeMenuFlutuante(false);
    navigate('/Home');
  }
  
  async function handleUsuarios() {
    setExibeMenuFlutuante(false);
    navigate('/Usuarios');
  }
  
  async function handleGrupos() {
    setExibeMenuFlutuante(false);
    navigate('/Grupos');
  }
  
  async function handleCompanhias() {
    setExibeMenuFlutuante(false);
    navigate('/Companhias');
  }
  
  async function handleOrgaos() {
    setExibeMenuFlutuante(false);
    navigate('/Orgaos');
  }
  
  async function handleCargos() {
    setExibeMenuFlutuante(false);
    navigate('/Cargos');
  }
  
  async function handlePessoas() {
    setExibeMenuFlutuante(false);
    navigate('/Pessoas');
  }
  
  async function handleSair() {
    setExibeMenuFlutuante(false);
    await logOut();
    navigate('/');
  }
  
  return(
    <div>
      <header>
        <div className='app-name'>
            <Link to='/Home'>
              Administradores de Companhias Abertas
            </Link>
        </div>
        <>
          { signed ? (
            <>
            <div className='header-buttons'>
              { signed    && <Link className='header-button'   to='/Home'>      Principal </Link>}
              { userAdmin && <Link className='header-button'   to='/Usuarios'>  Usuários  </Link>}
              { signed    && <Link className='header-button'   to='/Grupos'>    Grupos    </Link>}
              { signed    && <Link className='header-button'   to='/Companhias'>Companhias</Link>}
              { signed    && <Link className='header-button'   to='/Orgaos'>    Órgãos    </Link>}
              { signed    && <Link className='header-button'   to='/Cargos'>    Cargos    </Link>}
              { signed    && <Link className='header-button'   to='/Pessoas'>   Pessoas   </Link>}
              <button className='header-button-sair' onClick={handleSair}>
                <BiExit color='#f0f0f0' size={21}/>
              </button>
            </div>
            <div className='floatingMenu-div'>
            <>
              { exibeMenuFlutuante ? (
              <div className='floating-menu-exibe'
                   onMouseOver={()=>{setExibeMenuFlutuante(true)}}
                   onMouseOut ={()=>(setExibeMenuFlutuante(false))}>
                <ul className="menu-items">
                {signed    && <li><button className='floating-button' onClick={handleHome}      >Principal </button></li>}
                {userAdmin && <li><button className='floating-button' onClick={handleUsuarios}  >Usuários  </button></li>}
                {signed    && <li><button className='floating-button' onClick={handleGrupos}    >Grupos    </button></li>}
                {signed    && <li><button className='floating-button' onClick={handleCompanhias}>Companhias</button></li>}
                {signed    && <li><button className='floating-button' onClick={handleOrgaos}    >Órgãos    </button></li>}
                {signed    && <li><button className='floating-button' onClick={handleCargos}    >Cargos    </button></li>}
                {signed    && <li><button className='floating-button' onClick={handlePessoas}   >Pessoas   </button></li>}
                <li><button className='floating-button' onClick={handleSair}      ><BiExit size={23}/></button></li>
                </ul>
              </div>
              ) : (
              <>
              </>
              )}
              </>
              <button className='menu-button'
                      onMouseOver={()=>{setExibeMenuFlutuante(true)}}
                      onMouseOut ={()=>(setExibeMenuFlutuante(false))}>
                <FiMenu color='#f0f0f0' size={19}/>
              </button>
            </div>
            </>
          ) : (
            <div></div>
          )}
        </>
      </header>
    </div>
  );
}

export default Header;