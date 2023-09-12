import './pessoas.css';

import { useEffect, useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';

import { db } from '../../services/firebaseConnection';
import { EditButtonIcon, DeleteButtonIcon, SortAscButtonIcon, SortDescButtonIcon } from '../../components/ButtonIcons';
import IncPessoa from '../../components/IncPessoa';
import AltPessoa from '../../components/AltPessoa';
import ExcPessoa from '../../components/ExcPessoa';
import { AuthContext } from '../../contexts/auth';

function Pessoas() {
  const collectionPessoas = collection(db, 'pessoas');
  const { userMaster }    = useContext(AuthContext);
  
  const [loading       , setLoading       ] = useState(true);
  const [tabPessoas    , setTabPessoas    ] = useState([]);
  const [exibeIncluir  , setExibeIncluir  ] = useState(false);
  const [exibeAlterar  , setExibeAlterar  ] = useState(false);
  const [exibeExcluir  , setExibeExcluir  ] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState(null);
  
  const scrollPositionRef = useRef(0);
  
  useEffect(() => {
    async function loadPessoas() {
      await carregaPessoas();
    }
    
    loadPessoas();
    
  }, []);
  
  useEffect(() => {
    if (document.getElementById("containerTabelaPessoas")) {
      const scrollVar = scrollPositionRef.current;
      document.getElementById("containerTabelaPessoas").scrollTo(
        { 
          top: scrollVar,
          behavior: "instant",
        }
      );
    }
  }, [carregaPessoas]);
  
  async function carregaPessoas() {
    setLoading(true);
    
    const queryPessoas = query(collectionPessoas);
    const qDocs        = await getDocs(queryPessoas);
    
    setTabPessoas([]);
    const queryIsEmpty = qDocs.size === 0;
    
    if(!queryIsEmpty){
      let lista = [];
      
      qDocs.forEach((doc) => {
        lista.push({
          uidPessoa    : doc.id,
          nomePessoa   : doc.data().nomePessoa,
          nomeIndice   : doc.data().nomePessoa.toUpperCase(),
        });
      });
      
      const ind = 'nomeIndice';
      lista.sort((a, b) => (a[ind] > b[ind]) ? 1 : ((b[ind] > a[ind]) ? -1 : 0));
      setTabPessoas([...lista]);
    }
    setLoading(false);
  }
  
  async function handleIncluiPessoa(nomePessoa) {
    const indNomePessoa = tabPessoas.findIndex((element) => element.nomePessoa.toUpperCase() === nomePessoa.toUpperCase());
    if (indNomePessoa === -1) {
      try {
        incluiPessoa(nomePessoa);
      } catch(error) {
        console.log(`Ocorreu um erro ${error}`);
      }
    } else {
      toast.error('Nome já cadastrado');
    }
  }
  
  async function incluiPessoa(nomePessoa) {
    await addDoc(collectionPessoas, {
      nomePessoa   : nomePessoa,
    })
    .then ( () => {
      toast.success('Pessoa incluída com sucesso');
    });
    await carregaPessoas();
    
    setSelectedPessoa(null);
    setExibeIncluir(false);
  }
  
  async function handleAlteraPessoa(uidPessoa, nomePessoa) {
    const indNomePessoa = tabPessoas.findIndex((element) => element.nomePessoa.toUpperCase() === nomePessoa.toUpperCase());
    if (indNomePessoa === -1 || tabPessoas[indNomePessoa].uidPessoa === uidPessoa) {
      try {
        await getDoc(doc(collectionPessoas, uidPessoa))
        .then ((docSnapshot) => {
          if (docSnapshot.exists()) {
            alteraPessoa(uidPessoa, nomePessoa);
          }
        });
      } catch(error) {
        console.log(`Ocorreu um erro ${error}`);
      }
    } else {
      toast.error('Nome já cadastrado');
    }
  }
  
  async function alteraPessoa(uidPessoa, nomePessoa) {
    await setDoc(doc(collectionPessoas, uidPessoa), {
      nomePessoa   : nomePessoa,
    })
    .then ( () => {
      toast.success('Pessoa alterada com sucesso');
    });
    await carregaPessoas();
    
    setSelectedPessoa(null);
    setExibeAlterar(false);
  }
  
  async function handleExcluiPessoa(uidPessoa) {
    try {
      const documentRef = doc(collectionPessoas, uidPessoa);
      
      await deleteDoc(documentRef);
      toast('Pessoa excluída');
      await carregaPessoas();
      
      setSelectedPessoa(null);
      setExibeExcluir(false);
      
    } catch (error) {
      console.log(`Ocorreu um erro ${error}`);
    }
  }
  
  function ascOrderPessoas(ind) {
    let lista = [];
    
    tabPessoas.forEach((pessoa) => {
      let indice = '';
      if ( ind === 'nome') {
        indice = pessoa.nomePessoa;
      }
      lista.push({
        uidPessoa    : pessoa.uidPessoa,
        nomePessoa   : pessoa.nomePessoa,
        sortIndex: indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] > b[indSort]) ? 1 : ((b[indSort] > a[indSort]) ? -1 : 0));
    setTabPessoas([...lista]);
  }
  
  function descOrderPessoas(ind) {
    let lista = [];
    
    tabPessoas.forEach((pessoa) => {
      let indice = '';
      if ( ind === 'nome') {
        indice = pessoa.nomePessoa;
      }
      lista.push({
        uidPessoa    : pessoa.uidPessoa,
        nomePessoa   : pessoa.nomePessoa,
        sortIndex: indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] < b[indSort]) ? 1 : ((b[indSort] < a[indSort]) ? -1 : 0));
    setTabPessoas([...lista]);
  }
  
  return(
    <div className='containerPessoas'>
      <h3>Pessoas</h3>
      { loading ? (
        <>
          <div className='Carregando'><h3>Carregando...</h3></div>
        </>
      ) : (
        <>
          {tabPessoas.length === 0 ? (
            <>
            {(exibeIncluir && !selectedPessoa) ? (
              <div className='destaquePessoa'>
                  <IncPessoa
                    handleIncluiPessoa={handleIncluiPessoa}
                    setSelectedPessoa={setSelectedPessoa}
                    setExibeIncluir={setExibeIncluir}
                  />
              </div>
            ) : (
              <div className='container'>
                <h3>Não há Pessoa cadastrada</h3>
                {userMaster && (
                  <button
                    className='botaoNovaPessoa'
                    onClick={() => {
                      setExibeIncluir(true);
                    }}
                    >
                    Nova Pessoa
                  </button>
                )}
              </div>
            )}
            </>
          ) : (
            <>
              { exibeIncluir && !selectedPessoa && (
                <div className='destaquePessoa'>
                    <IncPessoa
                      handleIncluiPessoa={handleIncluiPessoa}
                      setSelectedPessoa={setSelectedPessoa}
                      setExibeIncluir={setExibeIncluir}
                    />
                </div>
              )}
              { exibeAlterar && selectedPessoa && (
                <div className='destaquePessoa'>
                    <AltPessoa
                      altUidPessoa      ={selectedPessoa.uidPessoa}
                      altNomePessoa     ={selectedPessoa.nomePessoa}
                      handleAlteraPessoa={handleAlteraPessoa}
                      setSelectedPessoa ={setSelectedPessoa}
                      setExibeAlterar   ={setExibeAlterar}
                    />
                </div>
              )}
              { exibeExcluir && selectedPessoa && (
                <div className='destaquePessoa'>
                  <div>
                    <ExcPessoa
                      excUidPessoa      ={selectedPessoa.uidPessoa}
                      excNomePessoa     ={selectedPessoa.nomePessoa}
                      handleExcluiPessoa={handleExcluiPessoa}
                      setSelectedPessoa ={setSelectedPessoa}
                      setExibeExcluir   ={setExibeExcluir}
                    />
                  </div>
                </div>
              )}
              { !exibeIncluir && !exibeExcluir && !exibeAlterar && (
                <>
                  {userMaster && (
                    <button 
                      className='botaoNovaPessoa'
                      onClick={() => {
                        scrollPositionRef.current = document.getElementById("containerTabelaPessoas").scrollTop;
                        setExibeIncluir(true);
                      }}
                    >
                      Nova Pessoa
                    </button>
                  )}
                  <div className='containerTabelaPessoas' id ='containerTabelaPessoas'>
                    <table className='tabelaPessoas'>
                      <thead>
                        <tr>
                        <th scope='col'>
                            <div className='headerTabPessoas'>
                              <span>Nome</span>
                              <div className='headerTabPessoasButtons'>
                                <button onClick={() => ascOrderPessoas ('nome')}><SortAscButtonIcon/></button>
                                <button onClick={() => descOrderPessoas('nome')}><SortDescButtonIcon/></button>
                              </div>
                            </div>
                          </th>
                          {userMaster && (<th scope='col'>#</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {tabPessoas.map((item, index) => {
                          return(
                            <tr key={item.uidPessoa}>
                              <td className='tdNomePessoa' data-label='Nome:'>
                                {item.nomePessoa}
                              </td>
                              {userMaster && (
                                <td className='tdBotoesPessoas'>
                                  <button 
                                    className='botaoAcaoPessoa'
                                    onClick={() => {
                                      scrollPositionRef.current = document.getElementById("containerTabelaPessoas").scrollTop;
                                      setSelectedPessoa(item);
                                      setExibeAlterar(true);
                                    }}
                                  >
                                    <EditButtonIcon color='#1c1c1c'/>
                                  </button>
                                  <button 
                                    className='botaoAcaoPessoa'
                                    onClick={() => {
                                      scrollPositionRef.current = document.getElementById("containerTabelaPessoas").scrollTop;
                                      setSelectedPessoa(item);
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

export default Pessoas;
