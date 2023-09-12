import './altAdministrador.css';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { collection, Timestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { format, parse } from 'date-fns';

import { db } from '../../services/firebaseConnection';
import { fetchPessoas } from '../../utils/utilsDb';
import { fetchCompanhias } from '../../utils/utilsDb';
import { fetchOrgaos } from '../../utils/utilsDb';
import { fetchCargos } from '../../utils/utilsDb';

function AltAdministrador({ altUidAdministrador,
                            setSelectedAdministrador,
                            setExibeAlterar }) {
  const collectionAdministradores = collection(db, 'administradores');
  
  const [alterando         , setAlterando         ] = useState(false);
  const [altUidPessoa      , setAltUidPessoa      ] = useState('');
  const [altUidCompanhia   , setAltUidCompanhia   ] = useState('');
  const [altUidOrgao       , setAltUidOrgao       ] = useState('');
  const [altUidCargo       , setAltUidCargo       ] = useState('');
  const [altDtInicioMandato, setAltDtInicioMandato] = useState('');
  const [altDtFimMandato   , setAltDtFimMandato   ] = useState('');
  const [uidPessoa         , setUidPessoa         ] = useState('');
  const [uidCompanhia      , setUidCompanhia      ] = useState('');
  const [uidOrgao          , setUidOrgao          ] = useState('');
  const [uidCargo          , setUidCargo          ] = useState('');
  const [dtInicioMandato   , setDtInicioMandato   ] = useState('');
  const [dtFimMandato      , setDtFimMandato      ] = useState('');
  
  const [loadingTabelas, setLoadingTabelas] = useState(true);
  const [loadingAdmin  , setLoadingAdmin  ] = useState(true);
  const [tabPessoas    , setTabPessoas    ] = useState([]);
  const [tabCompanhias , setTabCompanhias ] = useState([]);
  const [tabOrgaos     , setTabOrgaos     ] = useState([]);
  const [tabCargos     , setTabCargos     ] = useState([]);
  
  useEffect(() => {
    async function fetchTabelas() {
      try {
        const docSnapshot = await getDoc(doc(collectionAdministradores, altUidAdministrador));
        if (docSnapshot.exists()) {
          setAltUidPessoa      (docSnapshot.data().uidPessoa);
          setAltUidCompanhia   (docSnapshot.data().uidCompanhia);
          setAltUidOrgao       (docSnapshot.data().uidOrgao);
          setAltUidCargo       (docSnapshot.data().uidCargo);
          const dtInicioMandato = docSnapshot.data().dtInicioMandato;
          setAltDtInicioMandato(dtInicioMandato.toDate());
          const dtFimMandato    = docSnapshot.data().dtFimMandato;
          if (dtFimMandato) {
            setAltDtFimMandato   (dtFimMandato.toDate());
          } else {
            setAltDtFimMandato   ('');
          }
          setLoadingAdmin(false);
        }
      
        const listaPessoas = await fetchPessoas();
        setTabPessoas(listaPessoas);
        
        const listaCompanhias = await fetchCompanhias();
        setTabCompanhias(listaCompanhias);
        
        const listaOrgaos = await fetchOrgaos();
        setTabOrgaos(listaOrgaos);
        
        const listaCargos = await fetchCargos();
        setTabCargos(listaCargos);
        
        setLoadingTabelas(false);
      } catch (error) {
        console.error('Error fetching grupos:', error);
        setLoadingTabelas(false);
      };
    }
    
    fetchTabelas();
    
  }, []);
  
  useEffect(() => {
    setUidPessoa      (altUidPessoa);
    setUidCompanhia   (altUidCompanhia);
    setUidOrgao       (altUidOrgao);
    setUidCargo       (altUidCargo);
    setDtInicioMandato(altDtInicioMandato!=='' ? altDtInicioMandato.toISOString().split('T')[0]: '');
    setDtFimMandato   (altDtFimMandato   !=='' ? altDtFimMandato.toISOString().split('T')[0]   : '');
  }, [loadingAdmin]);

  async function handleConfirm(e) {
    e.preventDefault();
    
    if (uidPessoa       === altUidPessoa && uidCompanhia    === altUidCompanhia &&
        uidOrgao        === altUidOrgao  && uidCargo        === altUidCargo     &&
        dtInicioMandato === altDtInicioMandato &&
        dtFimMandato    === altDtFimMandato) {
      handleCancel();
    } else {
      
      if ((dtFimMandato === '') || (dtInicioMandato <= dtFimMandato)) {
        const startDateUTC = format(parse(dtInicioMandato, 'yyyy-MM-dd', new Date()), "yyyy-MM-dd'T'HH:mm:ssxxx");
        const endDateUTC = dtFimMandato ? format(parse(dtFimMandato, 'yyyy-MM-dd', new Date()), "yyyy-MM-dd'T'HH:mm:ssxxx") : null;
        
        const timestampDtInicio = Timestamp.fromDate(new Date(startDateUTC));
        const timestampDtFim    = endDateUTC ? Timestamp.fromDate(new Date(endDateUTC)) : null;
        
        setAlterando(true);
        try {
          const docSnapshot = await getDoc(doc(collectionAdministradores, altUidAdministrador));
          if (docSnapshot.exists()) {
            await setDoc(doc(collectionAdministradores, altUidAdministrador), {
              uidPessoa      : uidPessoa,
              uidCompanhia   : uidCompanhia,
              uidOrgao       : uidOrgao,
              uidCargo       : uidCargo,
              dtInicioMandato: timestampDtInicio,
              dtFimMandato   : timestampDtFim,
            })
            .then ( () => {
              toast.success('Administrador alterado com sucesso');
            });
          }
        } catch(error) {
          console.error(`Ocorreu um erro ${error}`);
        }
        
        setSelectedAdministrador(null);
        setExibeAlterar(false);
        
      } else {
        toast.error('Fim do Mandato não pode ser antes do Início');
      }
    }
    
    setAlterando(false);
  };
  
  const handleCancel = () => {
    setSelectedAdministrador(null);
    setExibeAlterar(false);
  };
  
  return(
    <div className='altAdministradorComponent'>
      <strong>Altera Administrador</strong>
      {loadingTabelas ? (
      <>
        <br/><br/>
        <span>Aguarde. Carregando dados...</span>
        <br/><br/>
      </>
      ) : (
        <form onSubmit={handleConfirm}>
          <table>
            <tbody>
              <tr>
                <td className='altAdminTabLabels'>
                  <label className='altAdminLabel' htmlFor='altAdmPessoa'>Nome:</label>
                </td>
                <td>
                  <select
                    className='altInputAdministrador'
                    id='altAdmPessoa'
                    value={uidPessoa}
                    onChange={(e) => setUidPessoa(e.target.value)}
                    required
                  >
                    <option key='selectAdm' value=''>Selecione o Administrador</option>
                    {tabPessoas.map((pessoa) => (
                      <option key={pessoa.uidPessoa} value={pessoa.uidPessoa}>
                        {pessoa.nomePessoa}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className='altAdminTabLabels'>
                  <label className='altAdminLabel' htmlFor='altAdmCompanhia'>Companhia:</label>
                </td>
                <td>
                  <select
                    className='altInputAdministrador'
                    id='altAdmCompanhia'
                    value={uidCompanhia}
                    onChange={(e) => setUidCompanhia(e.target.value)}
                    required
                  >
                    <option key='selectCompanhia' value=''>Selecione a Companhia</option>
                    {tabCompanhias.map((companhia) => (
                      <option key={companhia.uidCompanhia} value={companhia.uidCompanhia}>
                        {companhia.razaoSocial}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className='altAdminTabLabels'>
                  <label className='altAdminLabel' htmlFor='altAdmOrgao'>Órgão:</label>
                </td>
                <td>
                  <select
                    className='altInputAdministrador'
                    id='altAdmOrgao'
                    value={uidOrgao}
                    onChange={(e) => setUidOrgao(e.target.value)}
                    required
                  >
                    <option key='selectOrgao' value=''>Selecione o Órgão</option>
                    {tabOrgaos.map((orgao) => (
                      <option key={orgao.uidOrgao} value={orgao.uidOrgao}>
                        {orgao.nomeOrgao}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className='altAdminTabLabels'>
                  <label className='altAdminLabel' htmlFor='altAdmCargo'>Cargo:</label>
                </td>
                <td>
                  <select
                    className='altInputAdministrador'
                    id='altAdmCargo'
                    value={uidCargo}
                    onChange={(e) => setUidCargo(e.target.value)}
                    required
                  >
                    <option key='selectCargo' value=''>Selecione o Cargo</option>
                    {tabCargos.map((cargo) => (
                      <option key={cargo.uidCargo} value={cargo.uidCargo}>
                        {cargo.nomeCargo}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className='altAdminTabLabels'>
                  <label className='altAdminLabel' htmlFor='dtInicioMandato'>Início do Mandato:</label>
                </td>
                <td>
                  <input
                    className='altInputAdministrador'
                    id='dtInicioMandato'
                    name='dtInicioMandato'
                    type='date'
                    value={dtInicioMandato}
                    placeholder='dd/mm/aaaa'
                    onChange={(e) => setDtInicioMandato(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className='altAdminTabLabels'>
                  <label className='altAdminLabel' htmlFor='dtFimMandato'>Fim do Mandato:</label>
                </td>
                <td>
                  <input
                    className='altInputAdministrador'
                    id='dtFimMandato'
                    name='dtFimMandato'
                    type='date'
                    value={dtFimMandato}
                    placeholder='dd/mm/aaaa'
                    onChange={(e) => setDtFimMandato(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className='altAdminBotoes'>
            <button className='botaoAltAdministradorComponent'
                    type='submit'>
              {alterando ? ('Alterando...') : ('Confirma')}
            </button>
            { alterando ? (
              <button className='botaoAltAdministradorComponentDisabled'
                      onClick={handleCancel} >
                Cancela
              </button>
            ) : (
              <button className='botaoAltAdministradorComponent'
                      onClick={handleCancel} >
                Cancela
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );    
}

export default AltAdministrador;
