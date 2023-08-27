import './excUsuario.css';
import React, { useState } from 'react';

function ExcUsuario({ 
            uidUsuario, 
            nomeUsuario, 
            emailUsuario, 
            statusUsuario, 
            handleExcluiUsuario, 
            setSelectedUsuario,
            setExibeExcluir }) {
  const [ excluindo, setExcluindo ] = useState(false);
  
  const handleConfirm = () => {
    setExcluindo(true);
    handleExcluiUsuario(uidUsuario);
  };
  
  const handleCancel = () => {
    setSelectedUsuario(null);
    setExibeExcluir(false);
  };
  
  return(
    <div className='excUsuarioComponent'>
      <strong>Exclui usuário?</strong>
      <table className='destaqueTable'>
        <tr>
          <td>Nome: </td>
          <td>
            <input 
              className='excInputUsuario'
              type='text' 
              placeholder='Nome'
              value={nomeUsuario}
              readOnly
            ></input>
          </td>
        </tr>
        <tr>
          <td>Email: </td>
          <td>
            <input 
              className='excInputUsuario'
              type='text' 
              placeholder='Email'
              value={emailUsuario}
              readOnly
            ></input>
          </td>
        </tr>
        <tr>
          <td>Status: </td>
          <td>
            <input 
              className='excInputUsuario'
              type='text' 
              placeholder='Status'
              value={statusUsuario}
              readOnly
            ></input>
          </td>
        </tr>
      </table>
      <div>
        <button className='botaoExcUsuarioComponent'
                onClick={handleConfirm}>
          {excluindo ? ('Excluindo...') : ('Confirma')}
        </button>
        { excluindo ? (
          <button className='botaoExcUsuarioComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoExcUsuarioComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default ExcUsuario;