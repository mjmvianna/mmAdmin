import './excAdministrador.css';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { collection, doc, getDoc, deleteDoc } from 'firebase/firestore';

import { db } from '../../services/firebaseConnection';
import { fetchPessoas } from '../../utils/utilsDb';
import { fetchCompanhias } from '../../utils/utilsDb';
import { fetchOrgaos } from '../../utils/utilsDb';
import { fetchCargos } from '../../utils/utilsDb';

function ExcAdministrador({ excUidAdministrador,
                            setSelectedAdministrador,
                            setExibeExcluir }) {
  const collectionAdministradores = collection(db, 'administradores');
  
  const [excluindo, setExcluindo] = useState(false);
  
  const [excNomeAdministrador, setExcNomeAdministrador] = useState('');
  const [excRazaoSocial      , setExcRazaoSocial      ] = useState('');
  const [excNomeOrgao        , setExcNomeOrgao        ] = useState('');
  const [excNomeCargo        , setExcNomeCargo        ] = useState('');
  const [excDtInicioMandato  , setExcDtInicioMandato  ] = useState('');
  const [excDtFimMandato     , setExcDtFimMandato     ] = useState('');
  const [dtInicioMandato     , setDtInicioMandato     ] = useState('');
  const [dtFimMandato        , setDtFimMandato        ] = useState('');
  
  useEffect(() => {
    async function fetchTabelas() {
      try {
        const docSnapshot = await getDoc(doc(collectionAdministradores, excUidAdministrador));
        if (docSnapshot.exists()) {
          const listaPessoas = await fetchPessoas();
          const uidPessoa = docSnapshot.data().uidPessoa;
          const indPessoa = listaPessoas.findIndex((element) => element.uidPessoa === uidPessoa);
          if (indPessoa !== -1) {
            setExcNomeAdministrador(listaPessoas[indPessoa].nomePessoa);
          } else {
            setExcNomeAdministrador('* Erro *');
          }
          
          const listaCompanhias = await fetchCompanhias();
          const uidCompanhia = docSnapshot.data().uidCompanhia;
          const indCompanhia = listaCompanhias.findIndex((element) => element.uidCompanhia === uidCompanhia);
          if (indCompanhia !== -1) {
            setExcRazaoSocial(listaCompanhias[indCompanhia].razaoSocial);
          } else {
            setExcRazaoSocial('* Erro *');
          }
          
          const listaOrgaos = await fetchOrgaos();
          const uidOrgao = docSnapshot.data().uidOrgao;
          const indOrgao = listaOrgaos.findIndex((element) => element.uidOrgao === uidOrgao);
          if (indOrgao !== -1) {
            setExcNomeOrgao(listaOrgaos[indOrgao].nomeOrgao);
          } else {
            setExcNomeOrgao('* Erro *');
          }
          
          const listaCargos = await fetchCargos();
          const uidCargo = docSnapshot.data().uidCargo;
          const indCargo = listaCargos.findIndex((element) => element.uidCargo === uidCargo);
          if (indCargo !== -1) {
            setExcNomeCargo(listaCargos[indCargo].nomeCargo);
          } else {
            setExcNomeCargo('* Erro *');
          }
          
          const excDtInicioMandato = docSnapshot.data().dtInicioMandato;
          setDtInicioMandato(excDtInicioMandato.toDate().toISOString().split('T')[0]);
          
          const excDtFimMandato = docSnapshot.data().dtFimMandato;
          if (excDtFimMandato) {
            setDtFimMandato(excDtFimMandato.toDate().toISOString().split('T')[0]);
          } else {
            setDtFimMandato('');
          }
        }
      } catch (error) {
        console.error('Error fetching tabelas:', error);
      };
    }
    fetchTabelas();
  }, []);

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
