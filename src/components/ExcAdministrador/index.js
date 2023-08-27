import './excAdministrador.css';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { collection, doc, deleteDoc } from 'firebase/firestore';

import { db } from '../../services/firebaseConnection';

function ExcAdministrador({ excUidAdministrador,
                            excNomeAdministrador,
                            excRazaoSocial,
                            excNomeOrgao,
                            excNomeCargo,
                            excDtInicioMandato,
                            excDtFimMandato,
                            setSelectedAdministrador,
                            setExibeExcluir }) {
  const collectionAdministradores = collection(db, 'administradores');
  
  const [excluindo, setExcluindo] = useState(false);
  const [dtInicioMandato   , setDtInicioMandato   ] = useState(excDtInicioMandato ? excDtInicioMandato.toISOString().split('T')[0] : '');
  const [dtFimMandato      , setDtFimMandato      ] = useState(excDtFimMandato    ? excDtFimMandato.toISOString().split('T')[0]    : '');
  
  async function handleConfirm(e) {
    e.preventDefault();
    
    setExcluindo(true);
    
    try {
      const documentRef = doc(collectionAdministradores, excUidAdministrador);
      
      await deleteDoc(documentRef);
      toast('Registro excluído');
      
      setSelectedAdministrador(null);
      setExibeExcluir(false);
      
    } catch (error) {
      console.log(`Ocorreu um erro ${error}`);
    }
  }
  
  const handleCancel = () => {
    setSelectedAdministrador(null);
    setExibeExcluir(false);
  };
  
  return(
    <div className='excAdministradorComponent'>
      <strong>Exclui Administrador?</strong>
      <form onSubmit={handleConfirm}>
        <table>
          <tbody>
            <tr>
              <td className='excAdminTabLabels'>
                <label className='excAdminLabel' htmlFor='excAdmPessoa'>Nome:</label>
              </td>
              <td>
                <input
                  className='excInputAdministrador'
                  id='excAdmPessoa'
                  name='excAdmPessoa'
                  type='text' 
                  placeholder='Nome'
                  value={excNomeAdministrador}
                  readOnly
                >
                </input>
              </td>
            </tr>
            <tr>
              <td className='excAdminTabLabels'>
                <label className='excAdminLabel' htmlFor='excAdmCompanhia'>Companhia:</label>
              </td>
              <td>
                <input
                  className='excInputAdministrador'
                  id='excAdmCompanhia'
                  name='excAdmCompanhia'
                  type='text'
                  placeholder='Companhia'
                  value={excRazaoSocial}
                  readOnly
                >
                </input>
              </td>
            </tr>
            <tr>
              <td className='excAdminTabLabels'>
                <label className='excAdminLabel' htmlFor='excAdmOrgao'>Órgão:</label>
              </td>
              <td>
                <input
                  className='excInputAdministrador'
                  id='excAdmOrgao'
                  name='excAdmOrgao'
                  type='text'
                  placeholder='Órgão'
                  value={excNomeOrgao}
                  readOnly
                >
                </input>
              </td>
            </tr>
            <tr>
              <td className='excAdminTabLabels'>
                <label className='excAdminLabel' htmlFor='excAdmCargo'>Cargo:</label>
              </td>
              <td>
                <input
                  className='excInputAdministrador'
                  id='excAdmCargo'
                  name='excAdmCargo'
                  type='text'
                  placeholder='Cargo'
                  value={excNomeCargo}
                  readOnly
                >
                </input>
              </td>
            </tr>
            <tr>
              <td className='excAdminTabLabels'>
                <label className='excAdminLabel' htmlFor='dtInicioMandato'>Início do Mandato:</label>
              </td>
              <td>
                <input
                  className='excInputAdministrador'
                  id='dtInicioMandato'
                  name='dtInicioMandato'
                  type='date'
                  value={dtInicioMandato}
                  placeholder='dd/mm/aaaa'
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td className='excAdminTabLabels'>
                <label className='excAdminLabel' htmlFor='dtFimMandato'>Fim do Mandato:</label>
              </td>
              <td>
                <input
                  className='excInputAdministrador'
                  id='dtFimMandato'
                  name='dtFimMandato'
                  type='date'
                  value={dtFimMandato}
                  placeholder='dd/mm/aaaa'
                  readOnly
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className='excAdminBotoes'>
          <button className='botaoExcAdministradorComponent'
                  type='submit'>
            {excluindo ? ('Excluindo...') : ('Confirma')}
          </button>
          { excluindo ? (
            <button className='botaoExcAdministradorComponentDisabled'
                    onClick={handleCancel} >
              Cancela
            </button>
          ) : (
            <button className='botaoExcAdministradorComponent'
                    onClick={handleCancel} >
              Cancela
            </button>
          )}
        </div>
      </form>
    </div>
  );    
}

export default ExcAdministrador;
