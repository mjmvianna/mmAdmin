import './altOrgao.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function AltOrgao({ altUidOrgao, altSiglaOrgao, altNomeOrgao, handleAlteraOrgao, setSelectedOrgao, setExibeAlterar }) {
  const [siglaOrgao, setSiglaOrgao] = useState(altSiglaOrgao);
  const [nomeOrgao , setNomeOrgao ] = useState(altNomeOrgao);
  const [alterando , setAlterando ] = useState(false);
  
  function handleConfirm() {
    if (siglaOrgao !== '') {
      if (nomeOrgao !== '') {
        if (siglaOrgao === altSiglaOrgao && nomeOrgao === altNomeOrgao) {
          handleCancel();
        } else {
          setAlterando(true);
          handleAlteraOrgao(altUidOrgao, siglaOrgao, nomeOrgao);
          setAlterando(false);
        }
      } else {
        toast.error('Nome do órgão não pode ficar em branco');
      }
    } else {
      toast.error('Sigla do órgão não pode ficar em branco');
    }
};
  
  function handleCancel() {
    setSelectedOrgao(null);
    setExibeAlterar(false);
  };
  
  return(
    <div className='altOrgaoComponent'>
      <strong>Altera Órgão da Administração</strong>
      <table className='destaqueTable'>
        <tbody>
          <tr>
            <td>Sigla: </td>
            <td>
              <input 
                className='altInputOrgao'
                id='siglaOrgao'
                name='siglaOrgao'
                type='text'
                required
                placeholder='siglaOrgao'
                value={siglaOrgao}
                onChange={ (e) => setSiglaOrgao(e.target.value) }
              ></input>
            </td>
          </tr>
          <tr>
            <td>Nome do Órgâo: </td>
            <td>
              <input 
                className='altInputOrgao'
                id='nomeOrgao'
                name='nomeOrgao'
                type='text' 
                required
                placeholder='Nome do Órgâo'
                value={nomeOrgao}
                onChange={ (e) => setNomeOrgao(e.target.value) }
              ></input>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button className='botaoAltOrgaoComponent'
                onClick={handleConfirm}>
          {alterando ? ('Alterando...') : ('Confirma')}
        </button>
        { alterando ? (
          <button className='botaoAltOrgaoComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoAltOrgaoComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );
}

export default AltOrgao;
