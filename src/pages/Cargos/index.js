import './cargos.css';

import { useEffect, useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';

import { db } from '../../services/firebaseConnection';
import { EditButtonIcon, DeleteButtonIcon, SortAscButtonIcon, SortDescButtonIcon } from '../../components/ButtonIcons';
import IncCargo from '../../components/IncCargo';
import AltCargo from '../../components/AltCargo';
import ExcCargo from '../../components/ExcCargo';
import { AuthContext } from '../../contexts/auth';

function Cargos() {
  const collectionCargos = collection(db, 'cargos');
  const { userMaster }   = useContext(AuthContext);
  
  const [loading,       setLoading]       = useState(true);
  const [tabCargos,     setTabCargos]     = useState([]);
  const [exibeIncluir,  setExibeIncluir]  = useState(false);
  const [exibeAlterar,  setExibeAlterar]  = useState(false);
  const [exibeExcluir,  setExibeExcluir]  = useState(false);
  const [selectedCargo, setSelectedCargo] = useState(null);
  
  const scrollPositionRef = useRef(0);
  
  useEffect(() => {
    async function loadCargos() {
      await carregaCargos();
    }
    
    loadCargos();
    
  }, []);
  
  useEffect(() => {
    if (document.getElementById("containerTabelaCargos")) {
      const scrollVar = scrollPositionRef.current;
      document.getElementById("containerTabelaCargos").scrollTo(
        { 
          top: scrollVar,
          behavior: "instant",
        }
      );
    }
  }, [carregaCargos]);
  
  async function carregaCargos() {
    setLoading(true);
    
    const queryCargos = query(collectionCargos);
    const qDocs       = await getDocs(queryCargos);
    setTabCargos([]);
    const queryIsEmpty = qDocs.size === 0;
    
    if(!queryIsEmpty){
      let lista = [];
      
      qDocs.forEach((doc) => {
        lista.push({
          uidCargo  : doc.id,
          nomeCargo : doc.data().nomeCargo,
          nomeIndice: doc.data().nomeCargo.toUpperCase(),
        });
      });
      
      const ind = 'nomeIndice';
      lista.sort((a, b) => (a[ind] > b[ind]) ? 1 : ((b[ind] > a[ind]) ? -1 : 0));
      setTabCargos([...lista]);
      
    }
    setLoading(false);
  }
  
  async function handleIncluiCargo(nomeCargo) {
    const indNomeCargo = tabCargos.findIndex((element) => element.nomeCargo.toUpperCase() === nomeCargo.toUpperCase());
    if (indNomeCargo === -1) {
      try {
        incluiCargo(nomeCargo);
      } catch(error) {
        console.log(`Ocorreu um erro ${error}`);
      }
    } else {
      toast.error('Nome de Cargo já cadastrado');
    }
  }
  
  async function incluiCargo(nomeCargo) {
    // Inclui o documento na collection 'cargos'
    await addDoc(collectionCargos, {
      nomeCargo : nomeCargo,
    })
    .then ( () => {
      toast.success('Cargo incluído com sucesso');
    });
    await carregaCargos();
    
    setSelectedCargo(null);
    setExibeIncluir(false);
  }
  
  async function handleAlteraCargo(uidCargo, nomeCargo) {
    const indNomeCargo = tabCargos.findIndex((element) => element.nomeCargo.toUpperCase() === nomeCargo.toUpperCase());
    if (indNomeCargo === -1 || tabCargos[indNomeCargo].uidCargo === uidCargo) {
      try {
        await getDoc(doc(collectionCargos, uidCargo))
        .then ((docSnapshot) => {
          if (docSnapshot.exists()) {
            alteraCargo(uidCargo, nomeCargo);
          }
        });
      } catch(error) {
        console.log(`Ocorreu um erro ${error}`);
      }
    } else {
      toast.error('Nome de Cargo já cadastrado');
    }
  }
  
  async function alteraCargo(uidCargo, nomeCargo) {
    // Altera o documento na collection 'cargos'
    await setDoc(doc(collectionCargos, uidCargo), {
      nomeCargo : nomeCargo,
    })
    .then ( () => {
      toast.success('Cargo alterado com sucesso');
    });
    await carregaCargos();
    
    setSelectedCargo(null);
    setExibeAlterar(false);
  }
  
  async function handleExcluiCargo(uidCargo) {
    try {
      const documentRef = doc(collectionCargos, uidCargo);
      
      await deleteDoc(documentRef);
      toast('Cargo excluído');
      await carregaCargos();
      
      setSelectedCargo(null);
      setExibeExcluir(false);
      
    } catch (error) {
      console.log(`Ocorreu um erro ${error}`);
    }
  }
  
  function ascOrderCargos(ind) {
    let lista = [];
    
    tabCargos.forEach((cargo) => {
      let indice = cargo.nomeCargo;
      lista.push({
        uidCargo  : cargo.uidCargo,
        nomeCargo : cargo.nomeCargo,
        sortIndex: indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] > b[indSort]) ? 1 : ((b[indSort] > a[indSort]) ? -1 : 0));
    setTabCargos([...lista]);
  }
  
  function descOrderCargos(ind) {
    let lista = [];
    
    tabCargos.forEach((cargo) => {
      let indice = cargo.nomeCargo;
      lista.push({
        uidCargo  : cargo.uidCargo,
        nomeCargo : cargo.nomeCargo,
        sortIndex: indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] < b[indSort]) ? 1 : ((b[indSort] < a[indSort]) ? -1 : 0));
    setTabCargos([...lista]);
  }
  
  return(
    <div className='containerCargos'>
      <h3>Cargos</h3>
      { loading ? (
        <>
          <div className='Carregando'><h3>Carregando...</h3></div>
        </>
      ) : (
        <>
          {tabCargos.length === 0 ? (
            <>
            {(exibeIncluir && !selectedCargo) ? (
              <div className='destaqueCargo'>
                <IncCargo
                  handleIncluiCargo={handleIncluiCargo}
                  setSelectedCargo={setSelectedCargo}
                  setExibeIncluir={setExibeIncluir}
            />
              </div>
            ) : (
              <div className='container'>
                <h3>Não há Cargo cadastrado</h3>
                {userMaster && (<button 
                  className='botaoNovoCargo'
                  onClick={() => {
                    setExibeIncluir(true);
                  }}
                >
                  Novo Cargo
                </button>)}
              </div>
            )}
            </>) : (
            <>
              {exibeIncluir && !selectedCargo && (
                <div className='destaqueCargo'>
                    <IncCargo
                      handleIncluiCargo={handleIncluiCargo}
                      setSelectedCargo={setSelectedCargo}
                      setExibeIncluir={setExibeIncluir}
              />
                </div>
              )}
              {exibeAlterar && selectedCargo && (
                <div className='destaqueCargo'>
                  <AltCargo
                      altUidCargo      ={selectedCargo.uidCargo}
                      altNomeCargo     ={selectedCargo.nomeCargo}
                      handleAlteraCargo={handleAlteraCargo}
                      setSelectedCargo ={setSelectedCargo}
                      setExibeAlterar  ={setExibeAlterar}
                />
                </div>
              )}
              {exibeExcluir && selectedCargo && (
                <div className='destaqueCargo'>
                  <div>
                    <ExcCargo
                        excUidCargo      ={selectedCargo.uidCargo}
                        excNomeCargo     ={selectedCargo.nomeCargo}
                        handleExcluiCargo={handleExcluiCargo}
                        setSelectedCargo ={setSelectedCargo}
                        setExibeExcluir  ={setExibeExcluir}
                    />
                  </div>
                </div>
              )}
              { !exibeIncluir && !exibeExcluir && !exibeAlterar && (
                <>
                  {userMaster && (
                    <button 
                      className='botaoNovoCargo'
                      onClick={() => {
                        scrollPositionRef.current = document.getElementById("containerTabelaCargos").scrollTop;
                        setExibeIncluir(true);
                      }}
                    >
                      Novo Cargo
                    </button>
                  )}
                  <div className='containerTabelaCargos' id='containerTabelaCargos'>
                    <table className='tabelaCargos'>
                      <thead>
                        <tr>
                          <th scope='col'>
                            <div className='headerTabCargos'>
                              <span>Nome do Cargo</span>
                              <div className='headerTabCargosButtons'>
                                <button onClick={() => ascOrderCargos ('nome')}><SortAscButtonIcon/></button>
                                <button onClick={() => descOrderCargos('nome')}><SortDescButtonIcon/></button>
                              </div>
                            </div>
                          </th>
                          {userMaster && (<th scope='col'>#</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {tabCargos.map((item, index) => {
                          return(
                            <tr key={item.uidCargo}>
                              <td className='tdNomeCargo' data-label='Cargo:'>
                                {item.nomeCargo}
                              </td>
                              {userMaster && (
                                <td className='tdBotoesCargos'>
                                <button 
                                    className='botaoAcaoCargo'
                                    onClick={() => {
                                      scrollPositionRef.current = document.getElementById("containerTabelaCargos").scrollTop;
                                      setSelectedCargo(item);
                                      setExibeAlterar(true);
                                    }}
                                  >
                                    <EditButtonIcon color='#1c1c1c'/>
                                  </button>
                                  <button 
                                    className='botaoAcaoCargo'
                                    onClick={() => {
                                      scrollPositionRef.current = document.getElementById("containerTabelaCargos").scrollTop;
                                      setSelectedCargo(item);
                                      setExibeExcluir(true);
                                    }}
                                  >
                                    <DeleteButtonIcon color='#1c1c1c'/>
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Cargos;
