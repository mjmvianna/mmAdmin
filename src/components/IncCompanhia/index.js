import './incCompanhia.css';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchGrupos } from '../../utils/utilsDb';

function IncCompanhia({ handleIncluiCompanhia, setSelectedCompanhia, setExibeIncluir }) {
  const [razaoSocial   , setRazaoSocial   ] = useState('');
  const [shortName     , setShortName     ] = useState('');
  const [grupoEconomico, setGrupoEconomico] = useState('');
  const [incluindo     , setIncluindo     ] = useState(false);
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
  
  const handleConfirm = () => {
    if (razaoSocial !== '' && shortName !== '' && grupoEconomico !== '') {
      setIncluindo(true);
      handleIncluiCompanhia(razaoSocial, shortName, grupoEconomico);
      setIncluindo(false);
    } else {
      toast.error('Preencha todos os campos');
    }
  };
  
  const handleCancel = () => {
    setSelectedCompanhia(null);
    setExibeIncluir(false);
  };
  
  return(
    <div className='incCompanhiaComponent'>
      <strong>Nova Companhia</strong>
      <table className='destaqueTable'>
        <tbody>
          <tr>
            <td>Razão Social: </td>
            <td>
              <input 
                className='incInputCompanhia'
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
                className='incInputCompanhia'
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
              <option key='' value=''>Selecione o Grupo Econômico</option>
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
        <button className='botaoIncCompanhiaComponent'
                onClick={handleConfirm}>
          {incluindo ? ('Cadastrando...') : ('Confirma')}
        </button>
        { incluindo ? (
          <button className='botaoIncCompanhiaComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoIncCompanhiaComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default IncCompanhia;
