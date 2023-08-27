import './altUsuario.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function AltUsuario({ 
            altUidUsuario,
            altNomeUsuario,
            altEmailUsuario,
            altStatusUsuario,
            handleAlteraUsuario,
            setSelectedUsuario,
            setExibeAlterar }) {
  const [nomeUsuario  , setNomeUsuario  ] = useState(altNomeUsuario);
  const [emailUsuario , setEmailUsuario ] = useState(altEmailUsuario);
  const [statusUsuario, setStatusUsuario] = useState(altStatusUsuario);
  const [alterando    , setAlterando    ] = useState(false);
  
  function handleConfirm() {
    if (nomeUsuario !== '') {
      if (nomeUsuario   === altNomeUsuario  &&
          statusUsuario === altStatusUsuario) {
        handleCancel();
      } else {
        setAlterando(true);
        handleAlteraUsuario(altUidUsuario, nomeUsuario, altEmailUsuario, statusUsuario);
        setAlterando(false);
      }
    } else {
      toast.error('Preencha todos os dados');
    }
  };
  
  function handleCancel() {
    setSelectedUsuario(null);
    setExibeAlterar(false);
  };
  
  return(
    <div className='altUsuarioComponent'>
      <strong>Altera Usuario</strong>
      <table className='destaqueTable'>
        <tbody>
          <tr>
            <td>E-mail: </td>
            <td>
              <input 
                className='altEmailUsuario'
                type='email' 
                placeholder='E-mail do usuário'
                value={altEmailUsuario}
                readOnly
              ></input>
            </td>
          </tr>
          <tr>
            <td>Nome: </td>
            <td>
              <input 
                className='altNomeUsuario'
                id='username'
                type='text' 
                name='username'
                autoComplete='username'
                required
                placeholder='Nome do Usuário'
                value={nomeUsuario}
                onChange={ (e) => setNomeUsuario(e.target.value) }
              ></input>
            </td>
          </tr>
          <tr>
            <td>Status: </td>
            <td>
              <select 
                className='altStatusUsuario'
                name='selectStatus' 
                id='statusUsuario'
                value={statusUsuario}
                onChange={(e) => setStatusUsuario(e.target.value)}
              >
                <option value='consulta'>consulta</option>
                <option value='master'  >master  </option>
                <option value='admin'   >admin   </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button className='botaoAltUsuarioComponent'
                onClick={handleConfirm}>
          {alterando ? ('Alterando...') : ('Confirma')}
        </button>
        { alterando ? (
          <button className='botaoAltUsuarioComponentDisabled'
                  onClick={handleCancel}>
            Cancela
          </button>
        ) : (
          <button className='botaoAltUsuarioComponent'
                  onClick={handleCancel}>
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default AltUsuario;
