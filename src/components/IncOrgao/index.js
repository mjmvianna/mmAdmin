import './incOrgao.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function IncOrgao({ handleIncluiOrgao, setSelectedOrgao, setExibeIncluir }) {
  const [siglaOrgao, setSiglaOrgao] = useState('');
  const [nomeOrgao , setNomeOrgao ] = useState('');
  const [incluindo , setIncluindo ] = useState(false);
  
  const handleConfirm = () => {
    if (siglaOrgao !== '' && nomeOrgao !== '') {
      setIncluindo(true);
      handleIncluiOrgao(siglaOrgao, nomeOrgao);
      setIncluindo(false);
    } else {
      toast.error('Preencha todos os campos');
    }
  };
  
  const handleCancel = () => {
    setSelectedOrgao(null);
    setExibeIncluir(false);
  };
  
  return(
    <div className='incOrgaoComponent'>
      <strong>Novo Órgao da Administração</strong>
      <table className='destaqueTable'>
        <tr>
          <td>Sigla: </td>
          <td>
            <input 
              className='IncInputOrgao'
              id='siglaOrgao'
              name='siglaOrgao'
              type='text'
              required
              placeholder='Sigla'
              value={siglaOrgao}
              onChange={ (e) => setSiglaOrgao(e.target.value) }
            ></input>
          </td>
        </tr>
        <tr>
          <td>Nome do Órgão: </td>
          <td>
            <input 
              className='IncInputOrgao'
              id='nomeOrgao'
              name='nomeOrgao'
              type='text' 
              required
              placeholder='Nome do Órgão'
              value={nomeOrgao}
              onChange={ (e) => setNomeOrgao(e.target.value) }
            ></input>
          </td>
        </tr>
      </table>
      <div>
        <button className='botaoIncOrgaoComponent'
                onClick={handleConfirm}>
          {incluindo ? ('Cadastrando...') : ('Confirma')}
        </button>
        { incluindo ? (
          <button className='botaoIncOrgaoComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoIncOrgaoComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default IncOrgao;
