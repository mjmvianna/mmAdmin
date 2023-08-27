import './excOrgao.css';
import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

function ExcOrgao({ 
            excUidOrgao,
            excSiglaOrgao,
            excNomeOrgao,
            handleExcluiOrgao,
            setSelectedOrgao,
            setExibeExcluir }) {
  const [excluindo, setExcluindo] = useState(false);
  const collectionAdministradores = collection(db, 'administradores');
  
  async function handleConfirm() {
    setExcluindo(true);

    // Se houver Administrador cadastrado no órgão selecionado,
    // exibir mensagem de erro e continuar no módulo.
    const administradorInOrgao = query(collectionAdministradores, where('uidOrgao', '==', excUidOrgao));
    const administradoresSnapshot = await getDocs(administradorInOrgao);
    if (administradoresSnapshot.empty) {
      handleExcluiOrgao(excUidOrgao);
    } else {
      toast.error('Há Administrador cadastrado nesse Órgão');
      setExcluindo(false);
    }
  };
  
  const handleCancel = () => {
    setSelectedOrgao(null);
    setExibeExcluir(false);
  };
  
  return(
    <div className='excOrgaoComponent'>
      <strong>Exclui Órgao da Administração?</strong>
      <table className='destaqueTable'>
        <tr>
          <td>Sigla: </td>
          <td>
            <input 
              className='excInputOrgao'
              id='siglaOrgao'
              name='siglaOrgao'
              type='text'
              placeholder='siglaOrgao'
              value={excSiglaOrgao}
              readOnly
            ></input>
          </td>
        </tr>
        <tr>
          <td>Nome do Órgâo: </td>
          <td>
            <input 
              className='excInputOrgao'
              id='nomeOrgao'
              name='nomeOrgao'
              type='text' 
              placeholder='Nome do Órgâo'
              value={excNomeOrgao}
              readOnly
            ></input>
          </td>
        </tr>
      </table>
      <div>
        <button className='botaoExcOrgaoComponent'
                onClick={handleConfirm}>
          {excluindo ? ('Excluindo...') : ('Confirma')}
        </button>
        { excluindo ? (
          <button className='botaoExcOrgaoComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoExcOrgaoComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default ExcOrgao;