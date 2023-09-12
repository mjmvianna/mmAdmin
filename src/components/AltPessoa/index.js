import './altPessoa.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function AltPessoa({ 
            altUidPessoa,
            altNomePessoa,
            handleAlteraPessoa,
            setSelectedPessoa,
            setExibeAlterar}) {
  const [nomePessoa   , setNomePessoa   ] = useState(altNomePessoa);
  const [alterando    , setAlterando    ] = useState(false);
  
  function handleConfirm() {
    if (nomePessoa !== '') {
      if (nomePessoa    === altNomePessoa) {
        handleCancel();
      } else {
        setAlterando(true);
        handleAlteraPessoa(altUidPessoa, nomePessoa);
        setAlterando(false);
      }
    } else {
      toast.error('Preencha todos os dados');
    }
  };
  
  function handleCancel() {
    setSelectedPessoa(null);
    setExibeAlterar(false);
  };
  
  return(
    <div className='altPessoaComponent'>
      <strong>Altera Pessoa</strong>
      <table className='destaqueTable'>
        <tbody>
          <tr>
            <td>Nome: </td>
            <td>
              <input 
                className='altInputPessoa'
                id='nomePessoa'
                name='nomePessoa'
                type='text' 
                required
                placeholder='Nome'
                value={nomePessoa}
                onChange={ (e) => setNomePessoa(e.target.value) }
              ></input>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button className='botaoAltPessoaComponent'
                onClick={handleConfirm}>
          {alterando ? ('Alterando...') : ('Confirma')}
        </button>
        { alterando ? (
          <button className='botaoAltPessoaComponentDisabled'
                  onClick={handleCancel}>
            Cancela
          </button>
        ) : (
          <button className='botaoAltPessoaComponent'
                  onClick={handleCancel}>
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default AltPessoa;
