import './excGrupo.css';
import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

function ExcGrupo({ 
            excUidGrupo,
            excNomeGrupo,
            handleExcluiGrupo,
            setSelectedGrupo,
            setExibeExcluir }) {
  const [excluindo, setExcluindo] = useState(false);
  const collectionCompanhias = collection(db, 'companhias');

  async function handleConfirm() {
    setExcluindo(true);

    // Se houver Companhia cadastrada do Grupo Econômico selecionado,
    // exibir mensagem de erro e continuar no módulo.
    const companhiasByGrupo = query(collectionCompanhias, where('grupoEconomico', '==', excUidGrupo));
    const companhiasSnapshot = await getDocs(companhiasByGrupo);
    if (companhiasSnapshot.empty) {
      handleExcluiGrupo(excUidGrupo);
    } else {
      toast.error('Há Companhia cadastrada para esse Grupo Econômico');
      setExcluindo(false);
    }
  };
  
  const handleCancel = () => {
    setSelectedGrupo(null);
    setExibeExcluir(false);
  };
  
  return(
    <div className='excGrupoComponent'>
      <strong>Exclui Grupo Econômico?</strong>
      <table className='destaqueTable'>
        <tr>
          <td>Nome do Grupo Econômico: </td>
          <td>
            <input 
              className='excInputGrupo'
              id='nomeGrupo'
              name='nomeGrupo'
              type='text' 
              placeholder='Nome do Grupo'
              value={excNomeGrupo}
              readOnly
            ></input>
          </td>
        </tr>
      </table>
      <div>
        <button className='botaoExcGrupoComponent'
                onClick={handleConfirm}>
          {excluindo ? ('Excluindo...') : ('Confirma')}
        </button>
        { excluindo ? (
          <button className='botaoExcGrupoComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoExcGrupoComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default ExcGrupo;
