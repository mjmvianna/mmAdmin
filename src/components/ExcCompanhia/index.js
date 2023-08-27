import './excCompanhia.css';
import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

function ExcCompanhia({ 
            excUidCompanhia, 
            excRazaoSocial, 
            excShortName,
            excNomeGrupoEconomico, 
            handleExcluiCompanhia, 
            setSelectedCompanhia, 
            setExibeExcluir }) {
  const [excluindo, setExcluindo] = useState(false);
  const collectionAdministradores = collection(db, 'administradores');
  
  async function handleConfirm() {
    setExcluindo(true);

    // Se houver Administrador cadastrado na Companhia selecionada,
    // exibir mensagem de erro e continuar no módulo.
    const administradorInCompanhia = query(collectionAdministradores, where('uidCompanhia', '==', excUidCompanhia));
    const administradoresSnapshot = await getDocs(administradorInCompanhia);
    if (administradoresSnapshot.empty) {
      handleExcluiCompanhia(excUidCompanhia);
    } else {
      toast.error('Há Administrador cadastrado nessa Companhia');
      setExcluindo(false);
    }
  };
  
  const handleCancel = () => {
    setSelectedCompanhia(null);
    setExibeExcluir(false);
  };
  
  return(
    <div className='excCompanhiaComponent'>
      <strong>Exclui Companhia?</strong>
      <table className='destaqueTable'>
        <tbody>
          <tr>
            <td>Razão Social: </td>
            <td>
              <input 
                className='excInputCompanhia'
                id='razaoSocial'
                name='razaoSocial'
                type='text' 
                placeholder='Razão Social'
                value={excRazaoSocial}
                readOnly
              ></input>
            </td>
          </tr>
          <tr>
            <td><i>Short Name</i>: </td>
            <td>
              <input 
                className='excInputCompanhia'
                id='shortName'
                name='shortName'
                type='text' 
                placeholder='Short Name'
                value={excShortName}
                readOnly
              ></input>
            </td>
          </tr>
          <tr>
            <td>Grupo Econômico: </td>
            <td>
              <input 
                className='excInputCompanhia'
                id='grupoEconomico'
                name='grupoEconomico'
                type='text' 
                placeholder='Grupo Econômico'
                value={excNomeGrupoEconomico}
                readOnly
              ></input>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button className='botaoExcCompanhiaComponent'
                onClick={handleConfirm}>
          {excluindo ? ('Excluindo...') : ('Confirma')}
        </button>
        { excluindo ? (
          <button className='botaoExcCompanhiaComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoExcCompanhiaComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default ExcCompanhia;