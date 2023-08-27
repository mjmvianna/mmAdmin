import './incCargo.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function IncCargo({ handleIncluiCargo, setSelectedCargo, setExibeIncluir }) {
  const [nomeCargo, setNomeCargo ] = useState('');
  const [incluindo, setIncluindo ] = useState(false);
  
  const handleConfirm = () => {
    if (nomeCargo !== '') {
      setIncluindo(true);
      handleIncluiCargo(nomeCargo);
      setIncluindo(false);
    } else {
      toast.error('Preencha o nome do cargo');
    }
  };
  
  const handleCancel = () => {
    setSelectedCargo(null);
    setExibeIncluir(false);
  };
  
  return(
    <div className='incCargoComponent'>
      <strong>Novo Cargo</strong>
      <table className='destaqueTable'>
        <thead>
          <tr>
            <td>Nome do Cargo: </td>
            <td>
              <input 
                className='incInputCargo'
                id='nomeCargo'
                name='nomeCargo'
                type='text' 
                required
                placeholder='Nome do Cargo'
                value={nomeCargo}
                onChange={ (e) => setNomeCargo(e.target.value) }
              ></input>
            </td>
          </tr>
        </thead>
      </table>
      <div>
        <button className='botaoIncCargoComponent'
                onClick={handleConfirm}>
          {incluindo ? ('Cadastrando...') : ('Confirma')}
        </button>
        { incluindo ? (
          <button className='botaoIncCargoComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoIncCargoComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );    
}

export default IncCargo;
