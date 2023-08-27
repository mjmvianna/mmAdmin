import './novoUsuario.css';

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AuthContext } from '../../contexts/auth';

function NovoUsuario() {
  const [nomeUsuario,   setNomeUsuario  ] = useState('');
  const [emailUsuario,  setEmailUsuario ] = useState('');
  const [senhaUsuario,  setSenhaUsuario ] = useState('');
  const [statusUsuario, setStatusUsuario] = useState('consulta');
  
  const { userAdmin, signUp, loadingAuth } = useContext( AuthContext );
  
  const navigate = useNavigate();

  // Somente abre o select de status para usuario admin
  // Outros usuários, apenas exibe status = consulta
  
  async function handleCadastrar(e) {
    e.preventDefault();
    
    if (emailUsuario !== '' && senhaUsuario  !== '' && 
        nomeUsuario  !== '' && statusUsuario !== '') {
      await signUp(emailUsuario, senhaUsuario, nomeUsuario, statusUsuario);
    } else {
      toast.error('Preencha todos os dados');
    }
  }
  
  function handleCancela() {
    if ( userAdmin ) {
      navigate('/Usuarios');
    } else {
      navigate('/');
    }
  }

  return(
    <div className='container'>
      <div className='data-container'>
        <form className='formNovoUsuario'
              onSubmit={handleCadastrar}>
          <h4>Novo usuário</h4>
          <input 
            id='e-mail'
            type='email' 
            name='e-mail'
            autoComplete='e-mail'
            required
            placeholder='E-mail do usuário'
            value={emailUsuario}
            onChange={ (e) => setEmailUsuario(e.target.value) }
          ></input>
          <input 
            id='username'
            type='text' 
            name='username'
            autoComplete='username'
            required
            placeholder='Nome do usuário'
            value={nomeUsuario}
            onChange={ (e) => setNomeUsuario(e.target.value) }
          ></input>
          <input 
            id='password'
            type='password' 
            name='password'
            autoComplete='new-password'
            required
            placeholder='Senha'
            value={senhaUsuario}
            onChange={ (e) => setSenhaUsuario(e.target.value)}
          ></input>
          <div className='botoesIncluiUsuario'>
            <button type='submit' 
                    className='login-button'>
              {loadingAuth ? 'Cadastrando...' : 'Cadastrar'}
            </button>
            <button type='button' 
                  className='login-button'
                  onClick={handleCancela}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovoUsuario;
