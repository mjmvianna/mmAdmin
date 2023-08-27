import './login.css';

import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../contexts/auth';

function Login() {
  const [emailUsuario, setEmailUsuario] = useState('');
  const [senhaUsuario, setSenhaUsuario] = useState('');
  
  const { signed, signIn, loadingAuth } = useContext(AuthContext);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (signed) {
      navigate('/Home');
    }
  }, [])

  async function handleLogin(e) {
    e.preventDefault();

    if (emailUsuario === '') {
      toast.error("Digite um e-mail válido");
    } else if ( senhaUsuario === '') {
      toast.error("Digite uma senha");
    } else {
      await signIn(emailUsuario, senhaUsuario);
    }
  }

  return(
    <div className='container'>
      <div className='data-container'>
        <form onSubmit={handleLogin}>
          <h3>Administradores de Companhias Abertas</h3>
          <input 
            id='e-mail'
            type='email' 
            name='e-mail'
            placeholder='E-mail'
            autoComplete='e-mail'
            required
            value={emailUsuario}
            onChange={ (e) => setEmailUsuario(e.target.value) }
          ></input>
          <input 
            id='password'
            type='password' 
            name='password'
            placeholder='Senha'
            autoComplete='password'
            required
            value={senhaUsuario}
            onChange={ (e) => setSenhaUsuario(e.target.value)}
          ></input>
          <div className='loginDivButtons'>
            <button type='submit' 
                    className='login-button'>
              {loadingAuth ? 'Carregando...' : 'Entrar'}
            </button>
            {!loadingAuth && (
              <Link   className='login-button'
                    to='/NovoUsuario'>
                Novo Usuário
              </Link>)
            }
          </div>
        </form>
      </div>
      <div className='container-disclaimer'>
        <h3>
        Todos os dados apresentados foram obtidos nos <i>sites </i> 
        de RI das Companhias, os quais são fontes 
        públicas. As informações aqui exibidas foram extraídas das 
        atas das Assembleias de Acionistas e das reuniões dos 
        Conselhos de Administração das Companhias.
        </h3>
      </div>
    </div>
  );
}

export default Login;