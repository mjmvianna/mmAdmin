import './orgaos.css';

import { useEffect, useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';

import { db } from '../../services/firebaseConnection';
import { EditButtonIcon, DeleteButtonIcon, SortAscButtonIcon, SortDescButtonIcon } from '../../components/ButtonIcons';
import IncOrgao from '../../components/IncOrgao';
import AltOrgao from '../../components/AltOrgao';
import ExcOrgao from '../../components/ExcOrgao';
import { AuthContext } from '../../contexts/auth';

function Orgaos() {
  const collectionOrgaos     = collection(db, 'orgaos');
  const { userMaster }   = useContext(AuthContext);
  
  const [loading,       setLoading]       = useState(true);
  const [tabOrgaos,     setTabOrgaos]     = useState([]);
  const [exibeIncluir,  setExibeIncluir]  = useState(false);
  const [exibeAlterar,  setExibeAlterar]  = useState(false);
  const [exibeExcluir,  setExibeExcluir]  = useState(false);
  const [selectedOrgao, setSelectedOrgao] = useState(null);
  
  const scrollPositionRef = useRef(0);
  
  useEffect(() => {
    async function loadOrgaos() {
      await carregaOrgaos();
    }
    
    loadOrgaos();
    
  }, []);
  
  useEffect(() => {
    if (document.getElementById("containerTabelaOrgaos")) {
      const scrollVar = scrollPositionRef.current;
      document.getElementById("containerTabelaOrgaos").scrollTo(
        { 
          top: scrollVar,
          behavior: "instant",
        }
      );
    }
  }, [carregaOrgaos]);
  
  async function carregaOrgaos() {
    setLoading(true);
    
    const queryOrgaos = query(collectionOrgaos);
    const qDocs       = await getDocs(queryOrgaos);
    setTabOrgaos([]);
    const queryIsEmpty = qDocs.size === 0;
    
    if(!queryIsEmpty){
      let lista = [];
      
      qDocs.forEach((doc) => {
        lista.push({
          uidOrgao  : doc.id,
          siglaOrgao: doc.data().siglaOrgao,
          nomeOrgao : doc.data().nomeOrgao,
          nomeIndice: doc.data().nomeOrgao.toUpperCase(),
        });
      });
      
      const ind = 'nomeIndice';
      lista.sort((a, b) => (a[ind] > b[ind]) ? 1 : ((b[ind] > a[ind]) ? -1 : 0));
      setTabOrgaos([...lista]);
      
    }
    setLoading(false);
  }
  
  async function handleIncluiOrgao(siglaOrgao, nomeOrgao) {
    const indSiglaOrgao = tabOrgaos.findIndex((element) => element.siglaOrgao.toUpperCase() === siglaOrgao.toUpperCase());
    if (indSiglaOrgao === -1) {
      const indNomeOrgao = tabOrgaos.findIndex((element) => element.nomeOrgao.toUpperCase() === nomeOrgao.toUpperCase());
      if (indNomeOrgao === -1) {
        try {
          incluiOrgao(siglaOrgao, nomeOrgao);
        } catch(error) {
          console.log(`Ocorreu um erro ${error}`);
        }
      } else {
        toast.error('Nome de Órgão já cadastrado');
      }
    } else {
      toast.error('Sigla de Órgão já cadastrada');
    }
  }
  
  async function incluiOrgao(siglaOrgao, nomeOrgao) {
    // Inclui o documento na collection 'Orgaos'
    await addDoc(collectionOrgaos, {
      siglaOrgao: siglaOrgao,
      nomeOrgao : nomeOrgao,
    })
    .then ( () => {
      toast.success('Órgão incluído com sucesso');
    });
    await carregaOrgaos();
    
    setSelectedOrgao(null);
    setExibeIncluir(false);
  }
  
  async function handleAlteraOrgao(uidOrgao, siglaOrgao, nomeOrgao) {
    const indSiglaOrgao = tabOrgaos.findIndex((element) => element.siglaOrgao.toUpperCase() === siglaOrgao.toUpperCase());
    if (indSiglaOrgao === -1 || tabOrgaos[indSiglaOrgao].uidOrgao === uidOrgao) {
      const indNomeOrgao = tabOrgaos.findIndex((element) => element.nomeOrgao.toUpperCase() === nomeOrgao.toUpperCase());
      if (indNomeOrgao === -1 || tabOrgaos[indNomeOrgao].uidOrgao === uidOrgao) {
        try {
          await getDoc(doc(collectionOrgaos, uidOrgao))
          .then ((docSnapshot) => {
            if (docSnapshot.exists()) {
              alteraOrgao(uidOrgao, siglaOrgao, nomeOrgao);
            }
          });
        } catch(error) {
          console.log(`Ocorreu um erro ${error}`);
        }
      } else {
        toast.error('Nome de Órgão já cadastrado');
      }
    } else {
      toast.error('Sigla de Órgão já cadastrada');
    }
  }
  
  async function alteraOrgao(uidOrgao, siglaOrgao, nomeOrgao) {
    // Altera o documento na collection 'Orgaos'
    await setDoc(doc(collectionOrgaos, uidOrgao), {
      siglaOrgao: siglaOrgao,
      nomeOrgao : nomeOrgao,
    })
    .then ( () => {
      toast.success('Órgão alterado com sucesso');
    });
    await carregaOrgaos();
    
    setSelectedOrgao(null);
    setExibeAlterar(false);
  }
  
  async function handleExcluiOrgao(uidOrgao) {
    try {
      const documentRef = doc(collectionOrgaos, uidOrgao);
      
      await deleteDoc(documentRef);
      toast('Orgao excluído');
      await carregaOrgaos();
      
      setSelectedOrgao(null);
      setExibeExcluir(false);
      
    } catch (error) {
      console.log(`Ocorreu um erro ${error}`);
    }
  }
  
  function ascOrderOrgaos(ind) {
    let lista = [];
    
    tabOrgaos.forEach((orgao) => {
      let indice = '';
      if ( ind === 'nome') {
        indice = orgao.nomeOrgao;
      } else {
        indice = orgao.siglaOrgao;
      }
      lista.push({
        uidOrgao  : orgao.uidOrgao,
        siglaOrgao: orgao.siglaOrgao,
        nomeOrgao : orgao.nomeOrgao,
        sortIndex: indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] > b[indSort]) ? 1 : ((b[indSort] > a[indSort]) ? -1 : 0));
    setTabOrgaos([...lista]);
  }
  
  function descOrderOrgaos(ind) {
    let lista = [];
    
    tabOrgaos.forEach((orgao) => {
      let indice = '';
      if ( ind === 'nome') {
        indice = orgao.nomeOrgao;
      } else {
        indice = orgao.siglaOrgao;
      }
      lista.push({
        uidOrgao  : orgao.uidOrgao,
        siglaOrgao: orgao.siglaOrgao,
        nomeOrgao : orgao.nomeOrgao,
        sortIndex: indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] < b[indSort]) ? 1 : ((b[indSort] < a[indSort]) ? -1 : 0));
    setTabOrgaos([...lista]);
  }
  
  return(
    <div className='containerOrgaos'>
      <h3>Órgãos da Administração</h3>
      { loading ? (
        <>
          <div className='Carregando'><h3>Carregando...</h3></div>
        </>
      ) : (
        <>
          {tabOrgaos.length === 0 ? (
            <>
            {(exibeIncluir && !selectedOrgao) ? (
              <div className='destaqueOrgao'>
                <IncOrgao
                  handleIncluiOrgao={handleIncluiOrgao}
                  setSelectedOrgao={setSelectedOrgao}
                  setExibeIncluir={setExibeIncluir}
                />
              </div>
            ) : (
              <div className='container'>
                <h3>Não há órgão cadastrado</h3>
                {userMaster && (<button 
                  className='botaoNovoOrgao'
                  onClick={() => {
                    setExibeIncluir(true);
                  }}
                >
                  Novo Órgão
                </button>)}
              </div>
            )}
            </>) : (
            <>
              {exibeIncluir && !selectedOrgao && (
                <div className='destaqueOrgao'>
                    <IncOrgao
                      handleIncluiOrgao={handleIncluiOrgao}
                      setSelectedOrgao={setSelectedOrgao}
                      setExibeIncluir={setExibeIncluir}
                    />
                </div>
              )}
              {exibeAlterar && selectedOrgao && (
                <div className='destaqueOrgao'>
                    <AltOrgao
                      altUidOrgao      ={selectedOrgao.uidOrgao}
                      altSiglaOrgao    ={selectedOrgao.siglaOrgao}
                      altNomeOrgao     ={selectedOrgao.nomeOrgao}
                      handleAlteraOrgao={handleAlteraOrgao}
                      setSelectedOrgao ={setSelectedOrgao}
                      setExibeAlterar  ={setExibeAlterar}
                    />
                </div>
              )}
              {exibeExcluir && selectedOrgao && (
                <div className='destaqueOrgao'>
                  <div>
                    <ExcOrgao
                      excUidOrgao      ={selectedOrgao.uidOrgao}
                      excSiglaOrgao    ={selectedOrgao.siglaOrgao}
                      excNomeOrgao     ={selectedOrgao.nomeOrgao}
                      handleExcluiOrgao={handleExcluiOrgao}
                      setSelectedOrgao ={setSelectedOrgao}
                      setExibeExcluir  ={setExibeExcluir}
                    />
                  </div>
                </div>
              )}
              { !exibeIncluir && !exibeExcluir && !exibeAlterar && (
                <>
                  {userMaster && (
                    <button 
                      className='botaoNovoOrgao'
                      onClick={() => {
                        scrollPositionRef.current = document.getElementById("containerTabelaOrgaos").scrollTop;
                        setExibeIncluir(true);
                      }}
                    >
                      Novo Órgão
                    </button>
                  )}
                  <div className='containerTabelaOrgaos' id='containerTabelaOrgaos'>
                    <table className='tabelaOrgaos'>
                      <thead>
                        <tr>
                        <th scope='col'>
                            <div className='headerTabOrgaos'>
                              <span>Nome do Órgão</span>
                              <div className='headerTabOrgaosButtons'>
                                <button onClick={() => ascOrderOrgaos ('nome')}><SortAscButtonIcon/></button>
                                <button onClick={() => descOrderOrgaos('nome')}><SortDescButtonIcon/></button>
                              </div>
                            </div>
                          </th>
                          <th scope='col'>
                            <div className='headerTabOrgaos'>
                              <span>Sigla</span>
                              <div className='headerTabOrgaosButtons'>
                                <button onClick={() => ascOrderOrgaos ('sigla')}><SortAscButtonIcon/></button>
                                <button onClick={() => descOrderOrgaos('sigla')}><SortDescButtonIcon/></button>
                              </div>
                            </div>
                          </th>
                          {userMaster && (<th scope='col'>#</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {tabOrgaos.map((item, index) => {
                          return(
                            <tr key={item.siglaOrgao}>
                              <td className='tdNomeOrgao' data-label='Órgão:'>
                                {item.nomeOrgao}
                              </td>
                              <td className='tdSiglaOrgao' data-label='Sigla:'>
                                {item.siglaOrgao}
                              </td>
                              {userMaster && (
                                <td className='tdBotoesOrgaos'>
                                <button 
                                    className='botaoAcaoOrgao'
                                    onClick={() => {
                                      scrollPositionRef.current = document.getElementById("containerTabelaOrgaos").scrollTop;
                                      setSelectedOrgao(item);
                                      setExibeAlterar(true);
                                    }}
                                  >
                                    <EditButtonIcon color='#1c1c1c'/>
                                  </button>
                                  <button 
                                    className='botaoAcaoOrgao'
                                    onClick={() => {
                                      scrollPositionRef.current = document.getElementById("containerTabelaOrgaos").scrollTop;
                                      setSelectedOrgao(item);
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

export default Orgaos;
