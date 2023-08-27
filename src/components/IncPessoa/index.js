import './incPessoa.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function IncPessoa({ handleIncluiPessoa, setSelectedPessoa, setExibeIncluir }) {
  const [nomePessoa   , setNomePessoa   ] = useState('');
  const [apelidoPessoa, setApelidoPessoa] = useState('');
  const [incluindo    , setincluindo    ] = useState(false);
  
  const handleConfirm = () => {
    if (nomePessoa !== '' && apelidoPessoa !== '') {
      setincluindo(true);
      handleIncluiPessoa(nomePessoa, apelidoPessoa);
      setincluindo(false);
    } else {
      toast.error('Preencha todos os campos');
    }
  };
  
  const handleCancel = () => {
    setSelectedPessoa(null);
    setExibeIncluir(false);
  };
  
  return(
    <div className='incPessoaComponent'>
      <strong>Nova Pessoa</strong>
      <table className='destaqueTable'>
        <tbody>
          <tr>
            <td>Nome: </td>
            <td>
              <input 
                className='incInputPessoa'
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
          <tr>
            <td>Apelido: </td>
            <td>
              <input 
                className='incInputPessoa'
                id='apelidoPessoa'
                name='apelidoPessoa'
                type='text' 
                required
                placeholder='Apelido'
                value={apelidoPessoa}
                onChange={ (e) => setApelidoPessoa(e.target.value)}
              ></input>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button className='botaoIncPessoaComponent'
                onClick={handleConfirm}>
          { incluindo ? ('Cadastrando...') : ('Confirma')}
        </button>
        { incluindo ? (
          <button className='botaoIncPessoaComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoIncPessoaComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default IncPessoa;
