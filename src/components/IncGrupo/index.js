import './incGrupo.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function IncGrupo({ handleIncluiGrupo, setSelectedGrupo, setExibeIncluir }) {
  const [nomeGrupo, setNomeGrupo ] = useState('');
  const [incluindo, setIncluindo ] = useState(false);
  
  const handleConfirm = () => {
    if (nomeGrupo !== '') {
      setIncluindo(true);
      handleIncluiGrupo(nomeGrupo);
      setIncluindo(false);
    } else {
      toast.error('Preencha o nome do Grupo Econômico');
    }
  };
  
  const handleCancel = () => {
    setSelectedGrupo(null);
    setExibeIncluir(false);
  };
  
  return(
    <div className='incGrupoComponent'>
      <strong>Novo Grupo Econômico</strong>
      <table className='destaqueTable'>
        <tr>
          <td>Nome do Grupo Econômico: </td>
          <td>
            <input 
              className='incInputGrupo'
              id='nomeGrupo'
              name='nomeGrupo'
              type='text' 
              required
              placeholder='Nome do Grupo Econômico'
              value={nomeGrupo}
              onChange={ (e) => setNomeGrupo(e.target.value) }
            ></input>
          </td>
        </tr>
      </table>
      <div>
        <button className='botaoIncGrupoComponent'
                onClick={handleConfirm}>
          {incluindo ? ('Cadastrando...') : ('Confirma')}
        </button>
        { incluindo ? (
          <button className='botaoIncGrupoComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoIncGrupoComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default IncGrupo;
