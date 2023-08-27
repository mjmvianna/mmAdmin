import './altGrupo.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function AltGrupo({ altUidGrupo, altNomeGrupo, handleAlteraGrupo, setSelectedGrupo, setExibeAlterar }) {
  const [nomeGrupo , setNomeGrupo ] = useState(altNomeGrupo);
  const [alterando , setAlterando ] = useState(false);
  
  function handleConfirm() {
    if (nomeGrupo !== '') {
      if (nomeGrupo === altNomeGrupo) {
        handleCancel();
      } else {
        setAlterando(true);
        handleAlteraGrupo(altUidGrupo, nomeGrupo);
        setAlterando(false);
      }
    } else {
      toast.error('Nome do Grupo Econômico não pode ficar em branco');
    }
  };
  
  function handleCancel() {
    setSelectedGrupo(null);
    setExibeAlterar(false);
  };
  
  return(
    <div className='altGrupoComponent'>
      <strong>Altera Grupo Econômico</strong>
      <table className='destaqueTable'>
        <tbody>
          <tr>
            <td>Nome do Grupo Econômico: </td>
            <td>
              <input 
                className='altInputGrupo'
                id='nomeGrupo'
                name='nomeGrupo'
                type='text' 
                required
                placeholder='Nome do Grupo'
                value={nomeGrupo}
                onChange={ (e) => setNomeGrupo(e.target.value) }
              ></input>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button className='botaoAltGrupoComponent'
                onClick={handleConfirm}>
          {alterando ? ('Alterando...') : ('Confirma')}
        </button>
        { alterando ? (
          <button className='botaoAltGrupoComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoAltGrupoComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );
}

export default AltGrupo;
