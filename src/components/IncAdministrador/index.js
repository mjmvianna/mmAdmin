import './incAdministrador.css';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { collection, Timestamp, addDoc } from 'firebase/firestore';
import { format, parse } from 'date-fns';

import { db } from '../../services/firebaseConnection';
import { fetchPessoas } from '../../utils/utilsDb';
import { fetchCompanhias } from '../../utils/utilsDb';
import { fetchOrgaos } from '../../utils/utilsDb';
import { fetchCargos } from '../../utils/utilsDb';

function IncAdministrador({ setExibeIncluir }) {
  const collectionAdministradores = collection(db, 'administradores');
  
  const [incluindo         , setIncluindo         ] = useState(false);
  const [uidPessoa         , setUidPessoa         ] = useState('');
  const [uidCompanhia      , setUidCompanhia      ] = useState('');
  const [uidOrgao          , setUidOrgao          ] = useState('');
  const [uidCargo          , setUidCargo          ] = useState('');
  const [dtInicioMandato   , setDtInicioMandato   ] = useState('');
  const [dtFimMandato      , setDtFimMandato      ] = useState('');
  
  const [loadingTabelas, setLoadingTabelas] = useState(true);
  const [tabPessoas    , setTabPessoas    ] = useState([]);
  const [tabCompanhias , setTabCompanhias ] = useState([]);
  const [tabOrgaos     , setTabOrgaos     ] = useState([]);
  const [tabCargos     , setTabCargos     ] = useState([]);
  
  useEffect(() => {
    async function fetchTabelas() {
      try {
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
  
  async function handleConfirm(e) {
    e.preventDefault();
    setIncluindo(true);
    
    if ((dtFimMandato === '') || (dtInicioMandato <= dtFimMandato)) {
      const startDateUTC = format(parse(dtInicioMandato, 'yyyy-MM-dd', new Date()), "yyyy-MM-dd'T'HH:mm:ssxxx");
      const endDateUTC = dtFimMandato ? format(parse(dtFimMandato, 'yyyy-MM-dd', new Date()), "yyyy-MM-dd'T'HH:mm:ssxxx") : null;
      
      const timestampDtInicio = Timestamp.fromDate(new Date(startDateUTC));
      const timestampDtFim    = endDateUTC ? Timestamp.fromDate(new Date(endDateUTC)) : null;
      
      try {
        await addDoc(collectionAdministradores, {
          uidPessoa      : uidPessoa,
          uidCompanhia   : uidCompanhia,
          uidOrgao       : uidOrgao,
          uidCargo       : uidCargo,
          dtInicioMandato: timestampDtInicio,
          dtFimMandato   : timestampDtFim,
        });
        
        toast.success('Registro incluído com sucesso!');
        
      }
      catch(error) {
        toast.error(`Houve algum erro: ${error}`);
      }
      
      setExibeIncluir(false);
    } else {
      toast.error('Fim do Mandato não pode ser antes do Início');
    }
    
    setIncluindo(false);
  };
  
  const handleCancel = () => {
    setExibeIncluir(false);
  };
  
  return(
    <div className='incAdministradorComponent'>
      <strong>Novo Registro</strong>
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
                <td className='incAdminTabLabels'>
                  <label className='incAdminLabel' htmlFor='incAdmPessoa'>Nome:</label>
                </td>
                <td>
                  <select
                    className='incInputAdministrador'
                    id='incAdmPessoa'
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
                <td className='incAdminTabLabels'>
                  <label className='incAdminLabel' htmlFor='incAdmCompanhia'>Companhia:</label>
                </td>
                <td>
                  <select
                    className='incInputAdministrador'
                    id='incAdmCompanhia'
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
                <td className='incAdminTabLabels'>
                  <label className='incAdminLabel' htmlFor='incAdmOrgao'>Órgão:</label>
                </td>
                <td>
                  <select
                    className='incInputAdministrador'
                    id='incAdmOrgao'
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
                <td className='incAdminTabLabels'>
                  <label className='incAdminLabel' htmlFor='incAdmCargo'>Cargo:</label>
                </td>
                <td>
                  <select
                    className='incInputAdministrador'
                    id='incAdmCargo'
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
                <td className='incAdminTabLabels'>
                  <label className='incAdminLabel' htmlFor='dtInicioMandato'>Início do Mandato:</label>
                </td>
                <td>
                  <input
                    className='incInputAdministrador'
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
                <td className='incAdminTabLabels'>
                  <label className='incAdminLabel' htmlFor='dtFimMandato'>Fim do Mandato:</label>
                </td>
                <td>
                  <input
                    className='incInputAdministrador'
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
          <div className='incAdminBotoes'>
            <button className='botaoIncAdministradorComponent'
                    type='submit'>
              {incluindo ? ('Cadastrando...') : ('Confirma')}
            </button>
            { incluindo ? (
              <button className='botaoIncAdministradorComponentDisabled'
                      onClick={handleCancel} >
                Cancela
              </button>
            ) : (
              <button className='botaoIncAdministradorComponent'
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

export default IncAdministrador;
