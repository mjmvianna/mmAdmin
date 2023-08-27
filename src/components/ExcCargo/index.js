import './excCargo.css';
import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

function ExcCargo({ 
            excUidCargo,
            excNomeCargo,
            handleExcluiCargo,
            setSelectedCargo,
            setExibeExcluir }) {
  const [excluindo, setExcluindo] = useState(false);
  const collectionAdministradores = collection(db, 'administradores');
  
  async function handleConfirm() {
    setExcluindo(true);

    // Se houver Administrador cadastrado no cargo selecionado,
    // exibir mensagem de erro e continuar no módulo.
    const administradorInCargo = query(collectionAdministradores, where('uidCargo', '==', excUidCargo));
    const administradoresSnapshot = await getDocs(administradorInCargo);
    if (administradoresSnapshot.empty) {
      handleExcluiCargo(excUidCargo);
    } else {
      toast.error('Há Administrador cadastrado nesse Cargo');
      setExcluindo(false);
    }
  };
  
  const handleCancel = () => {
    setSelectedCargo(null);
    setExibeExcluir(false);
  };
  
  return(
    <div className='excCargoComponent'>
      <strong>Exclui Cargo?</strong>
      <table className='destaqueTable'>
        <tr>
          <td>Nome do Cargo: </td>
          <td>
            <input 
              className='excInputCargo'
              id='nomeCargo'
              name='nomeCargo'
              type='text' 
              placeholder='Nome do Cargo'
              value={excNomeCargo}
              readOnly
            ></input>
          </td>
        </tr>
      </table>
      <div>
        <button className='botaoExcCargoComponent'
                onClick={handleConfirm}>
          {excluindo ? ('Excluindo...') : ('Confirma')}
        </button>
        { excluindo ? (
          <button className='botaoExcCargoComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoExcCargoComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default ExcCargo;
