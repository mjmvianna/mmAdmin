import './altCargo.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function AltCargo({ altUidCargo, altNomeCargo, handleAlteraCargo, setSelectedCargo, setExibeAlterar }) {
  const [nomeCargo , setNomeCargo ] = useState(altNomeCargo);
  const [alterando , setAlterando ] = useState(false);
  
  function handleConfirm() {
    if (nomeCargo !== '') {
      if (nomeCargo === altNomeCargo) {
        handleCancel();
      } else {
        setAlterando(true);
        handleAlteraCargo(altUidCargo, nomeCargo);
        setAlterando(false);
      }
    } else {
      toast.error('Nome do cargo não pode ficar em branco');
    }
  };
  
  function handleCancel() {
    setSelectedCargo(null);
    setExibeAlterar(false);
  };
  
  return(
    <div className='altCargoComponent'>
      <strong>Altera Cargo</strong>
      <table className='destaqueTable'>
        <tbody>
          <tr>
            <td>Nome do Cargo: </td>
            <td>
              <input 
                className='altInputCargo'
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
        </tbody>
      </table>
      <div>
        <button className='botaoAltCargoComponent'
                onClick={handleConfirm}>
          {alterando ? ('Alterando...') : ('Confirma')}
        </button>
        { alterando ? (
          <button className='botaoAltCargoComponentDisabled'
                  onClick={handleCancel} >
            Cancela
          </button>
        ) : (
          <button className='botaoAltCargoComponent'
                  onClick={handleCancel} >
            Cancela
          </button>
        )}
      </div>
    </div>
  );
}

export default AltCargo;
