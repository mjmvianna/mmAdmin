import './altCompanhia.css';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchGrupos } from '../../utils/utilsDb';

function AltCompanhia({ 
            altUidCompanhia, 
            altRazaoSocial, 
            altShortName, 
            altGrupoEconomico, 
            handleAlteraCompanhia, 
            setSelectedCompanhia, 
            setExibeAlterar }) {
  const [razaoSocial   , setRazaoSocial   ] = useState(altRazaoSocial);
  const [shortName     , setShortName     ] = useState(altShortName);
  const [grupoEconomico, setGrupoEconomico] = useState(altGrupoEconomico);
  const [alterando     , setAlterando     ] = useState(false);
  const [tabGrupos     , setTabGrupos     ] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const lista = await fetchGrupos();
        setTabGrupos(lista);
      } catch (error) {
        console.error('Error fetching grupos:', error);
      };
    }
    
    fetchData();
  }, []);
  
  function handleConfirm() {
    if (razaoSocial    !== '' && 
        shortName      !== '' && 
        grupoEconomico !== '') {
      if (razaoSocial    === altRazaoSocial && 
          shortName      === altShortName   && 
          grupoEconomico === altGrupoEconomico) {
        handleCancel();
      } else {
        setAlterando(true);
        handleAlteraCompanhia(altUidCompanhia, razaoSocial, shortName, grupoEconomico);
        setAlterando(false);
      }
    } else {
      toast.error('Preencha todos os dados');
    }
  };
  
  function handleCancel() {
    setSelectedCompanhia(null);
    setExibeAlterar(false);
  };
  
  return(
    <div className='altCompanhiaComponent'>
      <strong>Altera Companhia</strong>
      <table className='destaqueTable'>
        <tbody>
          <tr>
            <td>Razão Social: </td>
            <td>
              <input 
                className='altInputCompanhia'
                id='razaoSocial'
                name='razaoSocial'
                type='text' 
                required
                placeholder='Razão Social'
                value={razaoSocial}
                onChange={ (e) => setRazaoSocial(e.target.value) }
              ></input>
            </td>
          </tr>
          <tr>
            <td><i>Short Name</i>: </td>
            <td>
              <input 
                className='altInputCompanhia'
                id='shortName'
                name='shortName'
                type='text' 
                required
                placeholder='Short Name'
                value={shortName}
                onChange={ (e) => setShortName(e.target.value)}
              ></input>
            </td>
          </tr>
          <tr>
            <td>Grupo Econômico: </td>
            <td>
            <select 
                id="grupoSelect" 
                className='grupoSelectInc'
                value={grupoEconomico} 
                onChange={ (e) => setGrupoEconomico(e.target.value) }>
              {tabGrupos.map((grupo) => (
                <option key={grupo.uidGrupo} value={grupo.uidGrupo}>
                  {grupo.nomeGrupo}
                </option>
              ))}
            </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button className='botaoAltCompanhiaComponent'
                onClick={handleConfirm}>
          {alterando ? ('Alterando...') : ('Confirma')}
        </button>
        { alterando ? (
          <button className='botaoAltCompanhiaComponentDisabled'
                  onClick={handleCancel}>
            Cancela
          </button>
        ) : (
          <button className='botaoAltCompanhiaComponent'
                  onClick={handleCancel}>
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default AltCompanhia;
