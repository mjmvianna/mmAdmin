import './grupos.css';

import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';

import { db } from '../../services/firebaseConnection';
import { EditButtonIcon, DeleteButtonIcon, SortAscButtonIcon, SortDescButtonIcon } from '../../components/ButtonIcons';
import IncGrupo from '../../components/IncGrupo';
import AltGrupo from '../../components/AltGrupo';
import ExcGrupo from '../../components/ExcGrupo';
import { AuthContext } from '../../contexts/auth';

function Grupos() {
  const collectionGrupos = collection(db, 'grupos');
  
  const { userMaster } = useContext( AuthContext );
  
  const [loading,       setLoading]       = useState(true);
  const [tabGrupos,     setTabGrupos]     = useState([]);
  const [exibeIncluir,  setExibeIncluir]  = useState(false);
  const [exibeAlterar,  setExibeAlterar]  = useState(false);
  const [exibeExcluir,  setExibeExcluir]  = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  
  useEffect(() => {
    async function loadGrupos() {
      await carregaGrupos();
    }
    
    loadGrupos();
    
  }, []);
  
  async function carregaGrupos() {
    setLoading(true);
    
    const queryGrupos = query(collectionGrupos);
    const qDocs       = await getDocs(queryGrupos);
    setTabGrupos([]);
    const queryIsEmpty = qDocs.size === 0;
    
    if(!queryIsEmpty){
      let lista = [];
      
      qDocs.forEach((doc) => {
        lista.push({
          uidGrupo  : doc.id,
          nomeGrupo : doc.data().nomeGrupo,
          nomeIndice: doc.data().nomeGrupo.toUpperCase(),
        });
      });
      
      const ind = 'nomeIndice';
      lista.sort((a, b) => (a[ind] > b[ind]) ? 1 : ((b[ind] > a[ind]) ? -1 : 0));
      setTabGrupos([...lista]);
      
    }
    setLoading(false);
  }
  
  async function handleIncluiGrupo(nomeGrupo) {
    const indNomeGrupo = tabGrupos.findIndex((element) => element.nomeGrupo.toUpperCase() === nomeGrupo.toUpperCase());
    if (indNomeGrupo === -1) {
      try {
        incluiGrupo(nomeGrupo);
      } catch(error) {
        console.log(`Ocorreu um erro ${error}`);
      }
    } else {
      toast.error('Nome de Grupo Econômico já cadastrado');
    }
  }
  
  async function incluiGrupo(nomeGrupo) {
    // Inclui o documento na collection 'grupos'
    await addDoc(collectionGrupos, {
      nomeGrupo : nomeGrupo,
    })
    .then ( () => {
      toast.success('Grupo Econômico incluído com sucesso');
    });
    await carregaGrupos();
    
    setSelectedGrupo(null);
    setExibeIncluir(false);
  }
  
  async function handleAlteraGrupo(uidGrupo, nomeGrupo) {
    const indNomeGrupo = tabGrupos.findIndex((element) => element.nomeGrupo.toUpperCase() === nomeGrupo.toUpperCase());
    if (indNomeGrupo === -1 || tabGrupos[indNomeGrupo].uidGrupo === uidGrupo) {
      try {
        await getDoc(doc(collectionGrupos, uidGrupo))
        .then ((docSnapshot) => {
          if (docSnapshot.exists()) {
            alteraGrupo(uidGrupo, nomeGrupo);
          }
        });
      } catch(error) {
        console.log(`Ocorreu um erro ${error}`);
      }
    } else {
      toast.error('Nome de Grupo Econômico já cadastrado');
    }
  }
  
  async function alteraGrupo(uidGrupo, nomeGrupo) {
    // Altera o documento na collection 'Grupos'
    await setDoc(doc(collectionGrupos, uidGrupo), {
      nomeGrupo : nomeGrupo,
    })
    .then ( () => {
      toast.success('Grupo Econômico alterado com sucesso');
    });
    await carregaGrupos();
    
    setSelectedGrupo(null);
    setExibeAlterar(false);
  }
  
  async function handleExcluiGrupo(uidGrupo) {
    try {
      const documentRef = doc(collectionGrupos, uidGrupo);
      
      await deleteDoc(documentRef);
      toast('Grupo Econômico excluído');
      await carregaGrupos();
      
      setSelectedGrupo(null);
      setExibeExcluir(false);
      
    } catch (error) {
      console.log(`Ocorreu um erro ${error}`);
    }
  }
  
  function ascOrderGrupos(ind) {
    let lista = [];
    
    tabGrupos.forEach((grupo) => {
      let indice = grupo.nomeGrupo;
      
      lista.push({
        uidGrupo : grupo.uidGrupo,
        nomeGrupo: grupo.nomeGrupo,
        sortIndex: indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] > b[indSort]) ? 1 : ((b[indSort] > a[indSort]) ? -1 : 0));
    setTabGrupos([...lista]);
  }
  
  function descOrderGrupos(ind) {
    let lista = [];
    
    tabGrupos.forEach((grupo) => {
      let indice = grupo.nomeGrupo;
      
      lista.push({
        uidGrupo : grupo.uidGrupo,
        nomeGrupo: grupo.nomeGrupo,
        sortIndex: indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] < b[indSort]) ? 1 : ((b[indSort] < a[indSort]) ? -1 : 0));
    setTabGrupos([...lista]);
  }
  
  return(
    <div className='containerGrupos'>
      <h3>Grupos Econômicos</h3>
      {loading ? (
        <>
          <div className='Carregando'><h3>Carregando...</h3></div>
        </>
      ) : (
        <>
          {tabGrupos.length === 0 ? (
            <>
            {(exibeIncluir && !selectedGrupo) ? (
              <div className='destaqueGrupo'>
                <IncGrupo
                  handleIncluiGrupo={handleIncluiGrupo}
                  setSelectedGrupo={setSelectedGrupo}
                  setExibeIncluir={setExibeIncluir}
            />
              </div>
            ) : (
              <div className='container'>
                <h3>Não há Grupo Econômico cadastrado</h3>
                {userMaster && (<button 
                  className='botaoNovoGrupo'
                  onClick={() => {
                    setExibeIncluir(true);
                  }}
                >
                  Novo Grupo Econômico
                </button>)}
              </div>
            )}
            </>) : (
            <>
              {exibeIncluir && !selectedGrupo && (
                <div className='destaqueGrupo'>
                    <IncGrupo
                      handleIncluiGrupo={handleIncluiGrupo}
                      setSelectedGrupo={setSelectedGrupo}
                      setExibeIncluir={setExibeIncluir}
              />
                </div>
              )}
              {exibeAlterar && selectedGrupo && (
                <div className='destaqueGrupo'>
                  <AltGrupo
                      altUidGrupo      ={selectedGrupo.uidGrupo}
                      altNomeGrupo     ={selectedGrupo.nomeGrupo}
                      handleAlteraGrupo={handleAlteraGrupo}
                      setSelectedGrupo ={setSelectedGrupo}
                      setExibeAlterar  ={setExibeAlterar}
                />
                </div>
              )}
              {exibeExcluir && selectedGrupo && (
                <div className='destaqueGrupo'>
                  <div>
                    <ExcGrupo
                        excUidGrupo      ={selectedGrupo.uidGrupo}
                        excNomeGrupo     ={selectedGrupo.nomeGrupo}
                        handleExcluiGrupo={handleExcluiGrupo}
                        setSelectedGrupo ={setSelectedGrupo}
                        setExibeExcluir  ={setExibeExcluir}
                    />
                  </div>
                </div>
              )}
              { !exibeIncluir && !exibeExcluir && !exibeAlterar && (
                <>
                  {userMaster && (<button 
                    className='botaoNovoGrupo'
                    onClick={() => {
                      setExibeIncluir(true);
                    }}
                  >
                    Novo Grupo Econômico
                  </button>)}
                  <div className='containerTabelaGrupos'>
                    <table className='tabelaGrupos'>
                      <thead>
                        <tr>
                          <th scope='col'>
                            <div className='headerTabGrupos'>
                              <span>Nome do Grupo Econômico</span>
                              <div className='headerTabGruposButtons'>
                                <button onClick={() => ascOrderGrupos ('nome')}><SortAscButtonIcon/></button>
                                <button onClick={() => descOrderGrupos('nome')}><SortDescButtonIcon/></button>
                              </div>
                            </div>
                          </th>
                          {userMaster && (<th scope='col'>#</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {tabGrupos.map((item, index) => {
                          return(
                            <tr key={item.uidGrupo}>
                              <td className='tdNomeGrupo' data-label='Grupo Econômico:'>
                                {item.nomeGrupo}
                              </td>
                              {userMaster && (
                              <td className='tdBotoesGrupos'>
                              <button 
                                  className='botaoAcaoGrupo'
                                  onClick={() => {
                                    setSelectedGrupo(item);
                                    setExibeAlterar(true);
                                  }}
                                >
                                  <EditButtonIcon color='#1c1c1c'/>
                                </button>
                                <button 
                                  className='botaoAcaoGrupo'
                                  onClick={() => {
                                    setSelectedGrupo(item);
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

export default Grupos;
