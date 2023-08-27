import './excPessoa.css';
import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

function ExcPessoa({ 
            excUidPessoa,
            excNomePessoa,
            excApelidoPessoa,
            handleExcluiPessoa,
            setSelectedPessoa,
            setExibeExcluir }) {
  const [ excluindo, setExcluindo ] = useState(false);
  const collectionAdministradores = collection(db, 'administradores');
  
  async function handleConfirm() {
    setExcluindo(true);

    // Se houver Administrador cadastrado com o nome da Pessoa selecionada,
    // exibir mensagem de erro e continuar no módulo.
    const administradorPessoa = query(collectionAdministradores, where('uidPessoa', '==', excUidPessoa));
    const administradoresSnapshot = await getDocs(administradorPessoa);
    if (administradoresSnapshot.empty) {
      handleExcluiPessoa(excUidPessoa);
    } else {
      toast.error('Essa Pessoa está cadastrada como Administrador(a)');
      setExcluindo(false);
    }
  };
  
  const handleCancel = () => {
    setSelectedPessoa(null);
    setExibeExcluir(false);
  };
  
  return(
    <div className='excPessoaComponent'>
      <strong>Exclui Pessoa?</strong>
      <table className='destaqueTable'>
        <tbody>
          <tr>
            <td>Nome: </td>
            <td>
              <input 
                className='excInputPessoa'
                id='nomePessoa'
                name='nomePessoa'
                type='text' 
                placeholder='Nome'
                value={excNomePessoa}
                readOnly
              ></input>
            </td>
          </tr>
          <tr>
            <td>Apelido: </td>
            <td>
              <input 
                className='excInputPessoa'
                id='apelidoPessoa'
                name='apelidoPessoa'
                type='text' 
                placeholder='Apelido'
                value={excApelidoPessoa}
                readOnly
              ></input>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button className='botaoExcPessoaComponent'
                onClick={handleConfirm}>
          {excluindo ? ('Excluindo...') : ('Confirma')}
        </button>
        { excluindo ? (
          <button className='botaoExcPessoaComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoExcPessoaComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default ExcPessoa;