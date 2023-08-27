import './companhias.css';

import { useEffect, useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';

import { db } from '../../services/firebaseConnection';
import { fetchGrupos } from '../../utils/utilsDb';
import { EditButtonIcon, DeleteButtonIcon, SortAscButtonIcon, SortDescButtonIcon } from '../../components/ButtonIcons';
import IncCompanhia from '../../components/IncCompanhia';
import AltCompanhia from '../../components/AltCompanhia';
import ExcCompanhia from '../../components/ExcCompanhia';
import { AuthContext } from '../../contexts/auth';

function Companhias() {
  const collectionCompanhias = collection(db, 'companhias');
  const { userMaster } = useContext(AuthContext);
  
  const [loading          , setLoading          ] = useState(true);
  const [tabCompanhias    , setTabCompanhias    ] = useState([]);
  const [tabGrupos        , setTabGrupos        ] = useState([]);
  const [exibeIncluir     , setExibeIncluir     ] = useState(false);
  const [exibeAlterar     , setExibeAlterar     ] = useState(false);
  const [exibeExcluir     , setExibeExcluir     ] = useState(false);
  const [selectedCompanhia, setSelectedCompanhia] = useState(null);
  
  const scrollPositionRef = useRef(0);
  
  useEffect(() => {
    async function fetchTabGrupos() {
      try {
        const listaGrupos = await fetchGrupos();
        setTabGrupos(listaGrupos);
      } catch (error) {
        console.error('Error fetching grupos:', error);
      };
    }
    
    fetchTabGrupos();
    
  }, []);
  
  useEffect(() => {
    async function loadCompanhias() {
      await carregaCompanhias();
    }
    
    loadCompanhias();
    
  }, [tabGrupos]);

  useEffect(() => {
    async function loadCompanhias() {
      await carregaCompanhias();
    }
    
    if (!exibeIncluir && !exibeAlterar && !exibeExcluir) {
      loadCompanhias();
    }
  }, [exibeIncluir, exibeAlterar, exibeExcluir]);
  
  useEffect(() => {
    if (document.getElementById("containerTabelaCompanhias")) {
      const scrollVar = scrollPositionRef.current;
      document.getElementById("containerTabelaCompanhias").scrollTo(
        { 
          top: scrollVar,
          behavior: "instant",
        }
      );
    }
  }, [carregaCompanhias]);
  
  function fNomeGrupo(uidGrupo) {
    const indGrupo = tabGrupos.findIndex((element) => element.uidGrupo === uidGrupo);
    if (indGrupo !== -1) {
      return tabGrupos[indGrupo].nomeGrupo;
    } else {
      return '* erro *';
    }
  }

  async function carregaCompanhias() {
    setLoading(true);
    
    const queryCompanhias = query(collectionCompanhias);
    const qDocs           = await getDocs(queryCompanhias);
    setTabCompanhias([]);
    const queryIsEmpty = qDocs.size === 0;
    
    if(!queryIsEmpty){
      let lista = [];
      
      qDocs.forEach((doc) => {
        const razaoSocialDoc     = doc.data().razaoSocial;
        const nomeGrupoEconomico = fNomeGrupo(doc.data().grupoEconomico);
        const sortFieldDoc       = nomeGrupoEconomico.concat(razaoSocialDoc);
        lista.push({
          uidCompanhia  : doc.id,
          razaoSocial   : razaoSocialDoc,
          shortName     : doc.data().shortName,
          grupoEconomico: doc.data().grupoEconomico,
          nomeGrupo     : nomeGrupoEconomico,
          sortField     : sortFieldDoc.toUpperCase(),
        });
      });
      
      const ind = 'sortField';
      lista.sort((a, b) => (a[ind] > b[ind]) ? 1 : ((b[ind] > a[ind]) ? -1 : 0));
      setTabCompanhias([...lista]);
    }
    setLoading(false);
  }
  
  async function handleIncluiCompanhia(razaoSocial, shortName, grupoEconomico) {
    const indRazaoSocial = tabCompanhias.findIndex((element) => element.razaoSocial.toUpperCase() === razaoSocial.toUpperCase());
    if (indRazaoSocial === -1) {
      const indShortName = tabCompanhias.findIndex((element) => element.shortName.toUpperCase() === shortName.toUpperCase());
      if (indShortName === -1) {
        try {
          incluiCompanhia(razaoSocial, shortName, grupoEconomico);
        } catch(error) {
          console.log(`Ocorreu um erro ${error}`);
        }
      } else {
        toast.error('Short Name já cadastrado');
      }
    } else {
      toast.error('Razão Social já cadastrada');
    }
  }
  
  async function incluiCompanhia(razaoSocial, shortName, grupoEconomico) {
    await addDoc(collectionCompanhias, {
      razaoSocial   : razaoSocial,
      shortName     : shortName,
      grupoEconomico: grupoEconomico,
    })
    .then ( () => {
      toast.success('Companhia incluída com sucesso');
    });
    await carregaCompanhias();
    
    setSelectedCompanhia(null);
    setExibeIncluir(false);
  }
  
  async function handleAlteraCompanhia(uidCompanhia, razaoSocial, shortName, grupoEconomico) {
    const indRazaoSocial = tabCompanhias.findIndex((element) => element.razaoSocial.toUpperCase() === razaoSocial.toUpperCase());
    if (indRazaoSocial === -1 || tabCompanhias[indRazaoSocial].uidCompanhia === uidCompanhia) {
      const indShortName = tabCompanhias.findIndex((element) => element.shortName.toUpperCase() === shortName.toUpperCase());
      if (indShortName === -1 || tabCompanhias[indShortName].uidCompanhia === uidCompanhia) {
        try {
          await getDoc(doc(collectionCompanhias, uidCompanhia))
          .then ((docSnapshot) => {
            if (docSnapshot.exists()) {
              alteraCompanhia(uidCompanhia, razaoSocial, shortName, grupoEconomico);
            }
          });
        } catch(error) {
          console.log(`Ocorreu um erro ${error}`);
        }
      } else {
        toast.error('Short Name já cadastrado');
      }
    } else {
      toast.error('Razão Social já cadastrada');
    }
  }
  
  async function alteraCompanhia(uidCompanhia, razaoSocial, shortName, grupoEconomico) {
    // Altera o documento na collection 'companhias'
    await setDoc(doc(collectionCompanhias, uidCompanhia), {
      razaoSocial   : razaoSocial,
      shortName     : shortName,
      grupoEconomico: grupoEconomico,
    })
    .then ( () => {
      toast.success('Companhia alterada com sucesso');
    });
    await carregaCompanhias();
    
    setSelectedCompanhia(null);
    setExibeAlterar(false);
  }
  
  async function handleExcluiCompanhia(uidCompanhia) {
    try {
      const documentRef = doc(collectionCompanhias, uidCompanhia);
      
      await deleteDoc(documentRef);
      toast('Companhia excluída');
      await carregaCompanhias();
      
      setSelectedCompanhia(null);
      setExibeExcluir(false);
      
    } catch (error) {
      console.log(`Ocorreu um erro ${error}`);
    }
  }

  function ascOrderCompanhias(ind) {
    setLoading(true);
    let lista = [];
    
    tabCompanhias.forEach((companhia) => {
      let indice = '';
      if ( ind === 'razaoSocial') {
        indice = companhia.razaoSocial;
      } else if (ind === 'shortName') {
        indice = companhia.shortName;
      } else {
        indice = companhia.nomeGrupo.concat(companhia.razaoSocial);
      }
      lista.push({
        uidCompanhia  : companhia.uidCompanhia,
        razaoSocial   : companhia.razaoSocial,
        shortName     : companhia.shortName,
        grupoEconomico: companhia.grupoEconomico,
        nomeGrupo     : companhia.nomeGrupo,
        sortIndex     : indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] > b[indSort]) ? 1 : ((b[indSort] > a[indSort]) ? -1 : 0));
    setTabCompanhias([...lista]);
    setLoading(false);
  }
  
  function descOrderCompanhias(ind) {
    setLoading(true);
    let lista = [];
    
    tabCompanhias.forEach((companhia) => {
      let indice = '';
      if ( ind === 'razaoSocial') {
        indice = companhia.razaoSocial;
      } else if (ind === 'shortName') {
        indice = companhia.shortName;
      } else {
        indice = companhia.nomeGrupo.concat(companhia.razaoSocial);
      }
      lista.push({
        uidCompanhia  : companhia.uidCompanhia,
        razaoSocial   : companhia.razaoSocial,
        shortName     : companhia.shortName,
        grupoEconomico: companhia.grupoEconomico,
        nomeGrupo     : companhia.nomeGrupo,
        sortIndex     : indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] < b[indSort]) ? 1 : ((b[indSort] < a[indSort]) ? -1 : 0));
    setTabCompanhias([...lista]);
    setLoading(false);
  }
  
  return(
    <div className='containerCompanhias'>
      <h3>Companhias</h3>
      <>
      {loading ? (
        <div className='Carregando'><h3>Carregando...</h3></div>
      ) : (
        <>
        {tabCompanhias.length === 0 ? (
          <>
          {(exibeIncluir && !selectedCompanhia) ? (
            <div className='destaqueCompanhia'>
                <IncCompanhia
                  handleIncluiCompanhia={handleIncluiCompanhia}
                  setSelectedCompanhia={setSelectedCompanhia}
                  setExibeIncluir={setExibeIncluir}
                />
            </div>
          ) : (
            <div className='container'>
              <h3>Não há Companhia cadastrada</h3>
              {userMaster && (<button 
                className='botaoNovaCompanhia'
                onClick={() => {
                  setExibeIncluir(true);
                }}
                >
                Nova Companhia
              </button>)}
            </div>
          )}
          </>
        ) : (
          <>
          { exibeIncluir && !selectedCompanhia && (
            <div className='destaqueCompanhia'>
                <IncCompanhia
                  handleIncluiCompanhia={handleIncluiCompanhia}
                  setSelectedCompanhia={setSelectedCompanhia}
                  setExibeIncluir={setExibeIncluir}
                />
            </div>
          )}
          { exibeAlterar && selectedCompanhia && (
            <div className='destaqueCompanhia'>
                <AltCompanhia
                  altUidCompanhia  ={selectedCompanhia.uidCompanhia}
                  altRazaoSocial   ={selectedCompanhia.razaoSocial}
                  altShortName     ={selectedCompanhia.shortName}
                  altGrupoEconomico={selectedCompanhia.grupoEconomico}
                  handleAlteraCompanhia={handleAlteraCompanhia}
                  setSelectedCompanhia={setSelectedCompanhia}
                  setExibeAlterar={setExibeAlterar}
                />
            </div>
          )}
          { exibeExcluir && selectedCompanhia && (
            <div className='destaqueCompanhia'>
              <div>
                <ExcCompanhia
                  excUidCompanhia      ={selectedCompanhia.uidCompanhia}
                  excRazaoSocial       ={selectedCompanhia.razaoSocial}
                  excShortName         ={selectedCompanhia.shortName}
                  excNomeGrupoEconomico={selectedCompanhia.nomeGrupo}
                  handleExcluiCompanhia={handleExcluiCompanhia}
                  setSelectedCompanhia ={setSelectedCompanhia}
                  setExibeExcluir      ={setExibeExcluir}
                />
              </div>
            </div>
          )}
          { !exibeIncluir && !exibeExcluir && !exibeAlterar && (
            <>
              {userMaster && (<button 
                className='botaoNovaCompanhia'
                onClick={() => {
                  scrollPositionRef.current = document.getElementById("containerTabelaCompanhias").scrollTop;
                  setExibeIncluir(true);
                }}
              >
                Nova Companhia
              </button>
              )}
              <div className='containerTabelaCompanhias' id='containerTabelaCompanhias'>
                <table className='tabelaCompanhias'>
                  <thead>
                    <tr>
                    <th scope='col'>
                        <div className='headerTabCompanhias'>
                          <span>Grupo Econômico</span>
                          <div className='headerTabCompanhiasButtons'>
                            <button onClick={() => ascOrderCompanhias ('grupoEconomico')}><SortAscButtonIcon/></button>
                            <button onClick={() => descOrderCompanhias('grupoEconomico')}><SortDescButtonIcon/></button>
                          </div>
                        </div>
                      </th>
                      <th scope='col'>
                        <div className='headerTabCompanhias'>
                          <span>Razão Social</span>
                          <div className='headerTabCompanhiasButtons'>
                            <button onClick={() => ascOrderCompanhias ('razaoSocial')}><SortAscButtonIcon/></button>
                            <button onClick={() => descOrderCompanhias('razaoSocial')}><SortDescButtonIcon/></button>
                          </div>
                        </div>
                      </th>
                      <th scope='col'>
                        <div className='headerTabCompanhias'>
                          <span>Short Name</span>
                          <div className='headerTabCompanhiasButtons'>
                            <button onClick={() => ascOrderCompanhias ('shortName')}><SortAscButtonIcon/></button>
                            <button onClick={() => descOrderCompanhias('shortName')}><SortDescButtonIcon/></button>
                          </div>
                        </div>
                      </th>
                      {userMaster && (<th scope='col'>#</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {tabCompanhias.map((item, index) => {
                      return(
                        <tr key={item.uidCompanhia}>
                          <td className='tdGrupoEconomico' data-label='Grupo Econômico:'>
                            {item.nomeGrupo}
                          </td>
                          <td className='tdRazaoSocial' data-label='Razão Social:'>
                            {item.razaoSocial}
                          </td>
                          <td className='tdShortName' data-label='Short Name:'>
                            {item.shortName}
                          </td>
                          {userMaster && (
                            <td className='tdBotoesCompanhias'>
                            <button 
                                className='botaoAcaoCompanhia'
                                onClick={() => {
                                  scrollPositionRef.current = document.getElementById("containerTabelaCompanhias").scrollTop;
                                  setSelectedCompanhia(item);
                                  setExibeAlterar(true);
                                }}
                              >
                                <EditButtonIcon color='#1c1c1c'/>
                              </button>
                              <button 
                                className='botaoAcaoCompanhia'
                                onClick={() => {
                                  scrollPositionRef.current = document.getElementById("containerTabelaCompanhias").scrollTop;
                                  setSelectedCompanhia(item);
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
      </>
    </div>
  );
}

export default Companhias;
