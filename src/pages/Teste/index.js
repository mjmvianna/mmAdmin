// Melhorias:
// -Alterar o ícone do index.html

import './home.css';

import { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';

import { db } from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';
import { fetchPessoas } from '../../utils/utilsDb';
import { fetchGrupos } from '../../utils/utilsDb';
import { fetchCompanhias } from '../../utils/utilsDb';
import { fetchOrgaos } from '../../utils/utilsDb';
import { fetchCargos } from '../../utils/utilsDb';
import { EditButtonIcon, DeleteButtonIcon, SortAscButtonIcon, SortDescButtonIcon } from '../../components/ButtonIcons';
import IncAdministrador from '../../components/IncAdministrador';
import AltAdministrador from '../../components/AltAdministrador';
import ExcAdministrador from '../../components/ExcAdministrador';

function Home() {
  const collectionAdministradores = collection(db, 'administradores');
  const { userMaster, userAdmin } = useContext(AuthContext);
  
  const [loading       , setLoading       ] = useState(true);
  const [loadingTabelas, setLoadingTabelas] = useState(true);
  const [tabPessoas    , setTabPessoas    ] = useState([]);
  const [tabGrupos     , setTabGrupos     ] = useState([]);
  const [tabCompanhias , setTabCompanhias ] = useState([]);
  const [tabOrgaos     , setTabOrgaos     ] = useState([]);
  const [tabCargos     , setTabCargos     ] = useState([]);
  const [exibeIncluir  , setExibeIncluir  ] = useState(false);
  const [exibeAlterar  , setExibeAlterar  ] = useState(false);
  const [exibeExcluir  , setExibeExcluir  ] = useState(false);
  const [ordenacao     , setOrdenacao     ] = useState('administrador');
  const [ordenacaoAsc  , setOrdenacaoAsc  ] = useState(true);
  const [filtro        , setFiltro        ] = useState('');//useState('administrador');
  const [conteudoFiltro, setConteudoFiltro] = useState([]);
  const [itemFiltro    , setItemFiltro    ] = useState('');
  
  const scrollPositionRef = useRef(0);
  
  // Carregar primeiro tabAdministradores, que será atualizada a cada
  // inclusão, alteração ou exclusão.
  // Havendo qualquer alteração em tabAdministradores, alterar 
  // tabAdminExibicao com base no filtro e na ordenação
  const [tabAdministradores   , setTabAdministradores   ] = useState([]);
  const [tabAdminExibicao     , setTabAdminExibicao     ] = useState([]);
  const [selectedAdministrador, setSelectedAdministrador] = useState(null);
  
  useEffect(() => {
    cancelaFiltroTabela();
    async function fetchTabelas() {
      try {
        const listaPessoas = await fetchPessoas();
        setTabPessoas(listaPessoas);
        
        const listaGrupos = await fetchGrupos();
        setTabGrupos(listaGrupos);
        
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
  
  useEffect(() => {
    setItemFiltro('');
    const listaFiltro = [];
    
    if (filtro === 'administrador') {
      const lista = tabPessoas;
      lista.forEach((item) => {
        listaFiltro.push({
          uidFiltro   : item.uidPessoa,
          nomeFiltro  : item.nomePessoa,
          indiceFiltro: item.nomePessoa.toUpperCase(),
        });
      });
    } else if (filtro === 'grupo') {
      const lista = tabGrupos;
      lista.forEach((item) => {
        listaFiltro.push({
          uidFiltro   : item.uidGrupo,
          nomeFiltro  : item.nomeGrupo,
          indiceFiltro: item.nomeGrupo.toUpperCase(),
        });
      });
    } else if (filtro === 'companhia') {
      const lista = tabCompanhias;
      lista.forEach((item) => {
        listaFiltro.push({
          uidFiltro   : item.uidCompanhia,
          nomeFiltro  : item.razaoSocial,
          indiceFiltro: item.razaoSocial.toUpperCase(),
        });
      });
    } else if (filtro === 'orgao') {
      const lista = tabOrgaos;
      lista.forEach((item) => {
        listaFiltro.push({
          uidFiltro   : item.uidOrgao,
          nomeFiltro  : item.nomeOrgao,
          indiceFiltro: item.nomeOrgao.toUpperCase(),
        });
      });
    } else if (filtro === 'cargo' ) {
      const lista = tabCargos;
      lista.forEach((item) => {
        listaFiltro.push({
          uidFiltro   : item.uidCargo,
          nomeFiltro  : item.nomeCargo,
          indiceFiltro: item.nomeCargo.toUpperCase(),
        });
      });
    }
    
    const ind = 'indiceFiltro';
    listaFiltro.sort((a, b) => (a[ind] > b[ind]) ? 1 : ((b[ind] > a[ind]) ? -1 : 0));
    setConteudoFiltro(listaFiltro);
  }, [filtro, tabPessoas, tabGrupos, tabCompanhias, tabOrgaos, tabCargos]);
  
  useEffect(() => {
    fOrdenaLista(tabAdminExibicao);
  },[ordenacao, ordenacaoAsc]);
  
  useEffect(() => {
    filtraTabela();
  }, [itemFiltro]);
  
  useEffect(() => {
    if (!exibeIncluir && !exibeAlterar && !exibeExcluir) {
      carregaAdministradores();
    }
  },[loadingTabelas, exibeIncluir, exibeAlterar, exibeExcluir]);
  
  useEffect(() => {
    filtraTabela();
    if (document.getElementById("containerDadosAdministradores")) {
      const scrollVar = scrollPositionRef.current;
      document.getElementById("containerDadosAdministradores").scrollTo(
        { 
          top: scrollVar,
          behavior: "instant",
        }
      );
    }
   },[tabAdministradores]);
  
  function fNomeAdministrador(uidPessoa) {
    const indPessoa = tabPessoas.findIndex((element) => element.uidPessoa === uidPessoa);
    if (indPessoa !== -1) {
      return tabPessoas[indPessoa].nomePessoa;
    } else {
      return '-';
    }
  }
  
  function fRazaoSocial(uidCompanhia) {
    const indCompanhia = tabCompanhias.findIndex((element) => element.uidCompanhia === uidCompanhia);
    if (indCompanhia !== -1) {
      return tabCompanhias[indCompanhia].razaoSocial;
    } else {
      return '-';
    }
  }
  
  function fShortNameCompanhia(uidCompanhia) {
    const indCompanhia = tabCompanhias.findIndex((element) => element.uidCompanhia === uidCompanhia);
    if (indCompanhia !== -1) {
      return tabCompanhias[indCompanhia].shortName;
    } else {
      return '-';
    }
  }
  
  function fUidGrupo(uidCompanhia) {
    const indCompanhia = tabCompanhias.findIndex((element) => element.uidCompanhia === uidCompanhia);
    if (indCompanhia !== -1) {
      return tabCompanhias[indCompanhia].uidGrupoEconomico;
    } else {
      return '-';
    }
  }
  
  function fNomeGrupo(uidCompanhia) {
    const indCompanhia = tabCompanhias.findIndex((element) => element.uidCompanhia === uidCompanhia);
    if (indCompanhia !== -1) {
      return tabCompanhias[indCompanhia].nomeGrupoEconomico;
    } else {
      return '-';
    }
  }
  
  function fNomeOrgao(uidOrgao) {
    const indOrgao = tabOrgaos.findIndex((element) => element.uidOrgao === uidOrgao);
    if (indOrgao !== -1) {
      return tabOrgaos[indOrgao].nomeOrgao;
    } else {
      return '-';
    }
  }
  
  function fSiglaOrgao(uidOrgao) {
    const indOrgao = tabOrgaos.findIndex((element) => element.uidOrgao === uidOrgao);
    if (indOrgao !== -1) {
      return tabOrgaos[indOrgao].siglaOrgao;
    } else {
      return '-';
    }
  }

  function fNomeCargo(uidCargo) {
    const indCargo = tabCargos.findIndex((element) => element.uidCargo === uidCargo);
    if (indCargo !== -1) {
      return tabCargos[indCargo].nomeCargo;
    } else {
      return '-';
    }
  }
  
  function fOrdenaLista(lista) {
    setTabAdminExibicao([]);
    
    const listaOrdenada = [];
    
    if (lista.length !== 0) {
      lista.forEach((doc) => {
        const uidAdministrador     = doc.uidAdministrador;
        const uidPessoa            = doc.uidPessoa;
        const uidCompanhia         = doc.uidCompanhia;
        const uidOrgao             = doc.uidOrgao;
        const uidCargo             = doc.uidCargo;
        const uidGrupoEconomico    = doc.uidGrupoEconomico;
        const dtInicioMandato      = doc.dtInicioMandato;
        const dtFimMandato         = doc.dtFimMandato;
        const nomeAdministrador    = doc.nomeAdministrador;
        const razaoSocialCompanhia = doc.razaoSocialCompanhia;
        const shortNameCompanhia   = doc.shortNameCompanhia;
        const nomeGrupoEconomico   = doc.nomeGrupoEconomico;
        const nomeOrgao            = doc.nomeOrgao;
        const siglaOrgao           = doc.siglaOrgao;
        const nomeCargo            = doc.nomeCargo;
        const dtInicioFormatted    = doc.dtInicioFormatted;
        const dtFimFormatted       = doc.dtFimFormatted;
        const anoInicioMandato     = String(dtInicioMandato.getFullYear());
        const mesInicioMandato     = String(dtInicioMandato.getMonth() + 1).padStart(2, '0');
        const diaInicioMandato     = String(dtInicioMandato.getDate()).padStart(2, '0');
        let   anoFimMandato        = '';
        let   mesFimMandato        = '';
        let   diaFimMandato        = '';
        if (dtFimMandato !== null) {
          anoFimMandato = String(dtFimMandato.getFullYear()) ;
          mesFimMandato = String(dtFimMandato.getMonth() + 1).padStart(2, '0');
          diaFimMandato = String(dtFimMandato.getDate()).padStart(2, '0');
        }
        
        let   sortField            = nomeAdministrador;
        if (ordenacao === 'administrador') {
          sortField = nomeAdministrador.concat(nomeGrupoEconomico).concat(shortNameCompanhia).concat(nomeOrgao);
        } else if (ordenacao === 'grupo') {
          sortField = nomeGrupoEconomico.concat(shortNameCompanhia).concat(nomeOrgao).concat(nomeAdministrador);
        } else if (ordenacao === 'companhia') {
          sortField = razaoSocialCompanhia.concat(nomeAdministrador).concat(nomeOrgao);
        } else if (ordenacao === 'orgao') {
          sortField = nomeOrgao.concat(nomeCargo).concat(nomeAdministrador);
        } else if (ordenacao === 'cargo' ) {
          sortField = nomeCargo.concat(shortNameCompanhia).concat(nomeAdministrador);
        } else if (ordenacao === 'inicioMandato') {
          sortField = anoInicioMandato.concat(mesInicioMandato).concat(diaInicioMandato).concat(nomeAdministrador).concat(shortNameCompanhia);
        } else if (ordenacao === 'fimMandato') {
          sortField = anoFimMandato.concat(mesFimMandato).concat(diaFimMandato).concat(nomeAdministrador).concat(shortNameCompanhia);
        }
        
        listaOrdenada.push({
          uidAdministrador    : uidAdministrador,
          uidPessoa           : uidPessoa,
          uidCompanhia        : uidCompanhia,
          uidOrgao            : uidOrgao,
          uidCargo            : uidCargo,
          uidGrupoEconomico   : uidGrupoEconomico,
          dtInicioMandato     : dtInicioMandato,
          dtFimMandato        : dtFimMandato,
          nomeAdministrador   : nomeAdministrador,
          razaoSocialCompanhia: razaoSocialCompanhia,
          shortNameCompanhia  : shortNameCompanhia,
          nomeGrupoEconomico  : nomeGrupoEconomico,
          nomeOrgao           : nomeOrgao,
          siglaOrgao          : siglaOrgao,
          nomeCargo           : nomeCargo,
          dtInicioFormatted   : dtInicioFormatted,
          dtFimFormatted      : dtFimFormatted,
          nomeIndice          : sortField.toUpperCase(),
        });
      });
      
      const ind = 'nomeIndice';
      if (ordenacaoAsc) {
        listaOrdenada.sort((a, b) => (a[ind] > b[ind]) ? 1 : ((b[ind] > a[ind]) ? -1 : 0));
      } else {
        listaOrdenada.sort((a, b) => (a[ind] < b[ind]) ? 1 : ((b[ind] < a[ind]) ? -1 : 0));
      }
    }
    setTabAdminExibicao([...listaOrdenada]);
  }
  
  async function carregaAdministradores() {
    setLoading(true);
    
    const queryAdministradores = query(collectionAdministradores);
    const qDocs                = await getDocs(queryAdministradores);
    const queryIsEmpty         = qDocs.size === 0;
    
    if(!queryIsEmpty){
      const lista = [];
      
      qDocs.forEach((doc) => {
        const nomeAdministrador    = fNomeAdministrador(doc.data().uidPessoa);
        const razaoSocialCompanhia = fRazaoSocial(doc.data().uidCompanhia);
        const shortNameCompanhia   = fShortNameCompanhia(doc.data().uidCompanhia);
        const uidGrupoEconomico    = fUidGrupo(doc.data().uidCompanhia);
        const nomeGrupoEconomico   = fNomeGrupo(doc.data().uidCompanhia);
        const nomeOrgao            = fNomeOrgao(doc.data().uidOrgao);
        const siglaOrgao           = fSiglaOrgao(doc.data().uidOrgao);
        const nomeCargo            = fNomeCargo(doc.data().uidCargo);
        const sortField            = nomeAdministrador.concat(shortNameCompanhia).concat(nomeOrgao);
        const dtInicioMandato      = doc.data().dtInicioMandato;
        const dataInicioMandato    = dtInicioMandato.toDate();
        const dtFimMandato         = doc.data().dtFimMandato;
        let   dataFimMandato       = null;
        if (dtFimMandato !== null) {
          dataFimMandato = dtFimMandato.toDate();
        }
        const dtInicioFormatted    = dataInicioMandato.toLocaleDateString();
        let   dtFimFormatted       = '';
        if (dataFimMandato !== null) {
          dtFimFormatted = dataFimMandato.toLocaleDateString();
        }
        lista.push({
          uidAdministrador    : doc.id,
          uidPessoa           : doc.data().uidPessoa,
          uidCompanhia        : doc.data().uidCompanhia,
          uidOrgao            : doc.data().uidOrgao,
          uidCargo            : doc.data().uidCargo,
          uidGrupoEconomico   : uidGrupoEconomico,
          dtInicioMandato     : dataInicioMandato,
          dtFimMandato        : dataFimMandato,
          nomeAdministrador   : nomeAdministrador,
          razaoSocialCompanhia: razaoSocialCompanhia,
          shortNameCompanhia  : shortNameCompanhia,
          nomeGrupoEconomico  : nomeGrupoEconomico,
          nomeOrgao           : nomeOrgao,
          siglaOrgao          : siglaOrgao,
          nomeCargo           : nomeCargo,
          dtInicioFormatted   : dtInicioFormatted,
          dtFimFormatted      : dtFimFormatted,
          nomeIndice          : sortField.toUpperCase(),
        });
      });
      
      setTabAdministradores(lista);
      fOrdenaLista(lista);
    }
    setLoading(false);
  }
  
  function filtraTabela() {
    if (itemFiltro === '') {
      fOrdenaLista(tabAdministradores);
    } else {
      let lista = [];
      if (filtro === 'administrador') {
        lista = tabAdministradores.filter(item => item.uidPessoa===itemFiltro);
      } else if (filtro === 'grupo') {
        lista = tabAdministradores.filter(item => item.uidGrupoEconomico===itemFiltro);
      } else if (filtro === 'companhia') {
        lista = tabAdministradores.filter(item => item.uidCompanhia===itemFiltro);
      } else if (filtro === 'orgao') {
        lista = tabAdministradores.filter(item => item.uidOrgao===itemFiltro);
      } else if (filtro === 'cargo') {
        lista = tabAdministradores.filter(item => item.uidCargo===itemFiltro);
      }
      fOrdenaLista(lista);
    }
  }
  
  function cancelaFiltroTabela() {
    setFiltro('');
    fOrdenaLista(tabAdministradores);
  }
  
  return(
    <div className='containerHome'>
      {loading ? (
        <>
          <h3>Administradores</h3>
          <div className='Carregando'>
            <h3>Aguarde. Carregando dados...</h3>
          </div>
        </>
      ) : (
        <>
          { exibeIncluir && !selectedAdministrador && (
            <>
              <h3>Administradores</h3>
              <div>
                {<IncAdministrador
                  setExibeIncluir  ={setExibeIncluir}
              />}
              </div>
            </>
          )}
          { exibeAlterar && selectedAdministrador && (
            <>
              <h3>Administradores</h3>
              <div>
                <AltAdministrador
                    altUidAdministrador = {selectedAdministrador.uidAdministrador}
                    altUidPessoa        = {selectedAdministrador.uidPessoa}
                    altUidCompanhia     = {selectedAdministrador.uidCompanhia}
                    altUidOrgao         = {selectedAdministrador.uidOrgao}
                    altUidCargo         = {selectedAdministrador.uidCargo}
                    altDtInicioMandato  = {selectedAdministrador.dtInicioMandato}
                    altDtFimMandato     = {selectedAdministrador.dtFimMandato}
                    setSelectedAdministrador = {setSelectedAdministrador}
                    setExibeAlterar          = {setExibeAlterar}
                />
              </div>
            </>
          )}
          { exibeExcluir && selectedAdministrador && (
            <>
              <h3>Administradores</h3>
              <div>
                <div>
                  <ExcAdministrador
                    excUidAdministrador = {selectedAdministrador.uidAdministrador}
                    excNomeAdministrador= {selectedAdministrador.nomeAdministrador}
                    excRazaoSocial      = {selectedAdministrador.razaoSocialCompanhia}
                    excNomeOrgao        = {selectedAdministrador.nomeOrgao}
                    excNomeCargo        = {selectedAdministrador.nomeCargo}
                    excDtInicioMandato  = {selectedAdministrador.dtInicioMandato}
                    excDtFimMandato     = {selectedAdministrador.dtFimMandato}
                    setSelectedAdministrador = {setSelectedAdministrador}
                    setExibeExcluir          = {setExibeExcluir}
                  />
                </div>
              </div>
            </>
          )}
          { !exibeIncluir && !exibeExcluir && !exibeAlterar && (
            <>
              <div className='headerAdministradores'>
                <div className='headerTituloInclui'>
                  {/*<h3>Administradores</h3>*/}
                  {userMaster && 
                  (<>
                    <button 
                      className='botaoNovoAdministrador'
                      onClick={() => {
                        scrollPositionRef.current = document.getElementById("containerDadosAdministradores").scrollTop;
                        setExibeIncluir(true);
                      }}
                    >
                      Novo Registro
                    </button>
                    { userAdmin && <Link className='botaoNovoAdministrador'   to='/Teste'>  Teste  </Link>}
                  </>)
                  }
                </div>
                <div className='headerBoxes'>
                  <div className='OrdenAdministradores'>
                    <small>Ordenação</small>
                    <select
                      className='selOptionsAdministrador'
                      id='selOrdenAdministrador'
                      value={ordenacao}
                      onChange={(e) => {
                        scrollPositionRef.current = 0;
                        setOrdenacao(e.target.value)
                      }}
                    >
                      <option key='ordAdmin'     value='administrador'>Administrador</option>
                      <option key='ordGrupo'     value='grupo'        >Grupo Econômico</option>
                      <option key='ordCompanhia' value='companhia'    >Companhia</option>
                      <option key='ordOrgao'     value='orgao'        >Órgão da Administração</option>
                      <option key='ordCargo'     value='cargo'        >Cargo</option>
                      <option key='ordInicio'    value='inicioMandato'>Início do Mandato</option>
                      <option key='ordFim'       value='fimMandato'   >Fim do Mandato</option>
                    </select>
                    <div className='botOrdenAdministrador'>
                      <div className='botAscOrdenAdministrador'>
                        <button onClick={() => {
                            scrollPositionRef.current = 0;
                            setOrdenacaoAsc(true)
                          }}>
                          <SortAscButtonIcon/>
                        </button>
                      </div>
                      <div className='botAscOrdenAdministrador'>
                        <button onClick={() => {
                            scrollPositionRef.current = 0;
                            setOrdenacaoAsc(false)
                          }}>
                          <SortDescButtonIcon/>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className='filtraAdministradores'>
                    <small>Filtro</small>
                    <select
                      className='selOptionsAdministrador'
                      id='selFiltroAdministrador'
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    >
                      <option key='filtVazio'     value=''             >Selecione um filtro</option>
                      <option key='filtAdmin'     value='administrador'>Administrador</option>
                      <option key='filtGrupo'     value='grupo'        >Grupo Econômico</option>
                      <option key='filtCompanhia' value='companhia'    >Companhia</option>
                      <option key='filtOrgao'     value='orgao'        >Órgão da Administração</option>
                      <option key='filtCargo'     value='cargo'        >Cargo</option>
                    </select>
                    <div className='selFiltroAdministrador'>
                      <select
                        className='selOptionsAdministrador'
                        id='selItemFiltroAdministrador'
                        value={itemFiltro}
                        onChange={(e) => setItemFiltro(e.target.value)}
                      >
                        <option key='filtVazio'   value=''>
                          {(filtro === '' ? 'Selecione um filtro acima' : 'Selecione um item a filtrar')}
                        </option>
                        {conteudoFiltro.map((item, index) => {
                          return(<option key={item.uidFiltro} value={item.uidFiltro}>{item.nomeFiltro}</option>)
                        })}
                      </select>
                    </div>
                    <div className='botOrdenAdministrador'>
                      <button onClick={cancelaFiltroTabela}>Cancelar</button>
                    </div>
                  </div>
                </div>
              </div>
              <div 
                className='containerDadosAdministradores'
                id='containerDadosAdministradores'>
                { tabAdminExibicao.length === 0 ? (
                  <>
                    <div className='tabelaVazia'>
                      <h4>Não há Administrador cadastrado para o filtro selecionado</h4>
                    </div>
                  </>
                ) : (
                  <>
                    {tabAdminExibicao.map((item, index) => {
                      return(
                        <div key={item.uidAdministrador.concat('admDivPrincipal')}
                            className='admDivPrincipal'>
                          <div key={item.uidAdministrador.concat('admDados')}
                              className='admDados'>
                            <div key={item.uidAdministrador.concat('adminDiv')}
                                className='adminDiv'>
                              <div key={item.uidAdministrador.concat('adminPrimeiroNivel')}
                                  className='adminPrimeiroNivel'>
                                <strong key={item.uidAdministrador.concat('info1PrimeiroNivel')}
                                        className='info1PrimeiroNivel'
                                >
                                  {(ordenacao==='administrador') && (<>{item.nomeAdministrador}</>)}
                                  {(ordenacao==='grupo'        ) && (<>{item.nomeGrupoEconomico}</>)}
                                  {(ordenacao==='companhia'    ) && (<>{item.razaoSocialCompanhia}</>)}
                                  {(ordenacao==='orgao'        ) && (<>{item.nomeOrgao}</>)}
                                  {(ordenacao==='cargo'        ) && (<>{item.nomeCargo}</>)}
                                  {(ordenacao==='inicioMandato') && (<>{`De ${item.dtInicioFormatted}`}</>)}
                                  {(ordenacao==='fimMandato'   ) && (<>{`De ${item.dtInicioFormatted}`}</>)}
                                </strong>
                                <em key={item.uidAdministrador.concat('info2PrimeiroNivel')}
                                    className='info2PrimeiroNivel'
                                >
                                  {(ordenacao==='administrador') && (<></>)}
                                  {(ordenacao==='grupo'        ) && (<>{`- Companhia: ${item.shortNameCompanhia}`}</>)}
                                  {(ordenacao==='companhia'    ) && (<>{`- Grupo: ${item.nomeGrupoEconomico}`}</>)}
                                  {(ordenacao==='orgao'        ) && (<>{`- ${item.nomeCargo}`}</>)}
                                  {(ordenacao==='cargo'        ) && (<>{`- ${item.nomeOrgao}`}</>)}
                                  {(ordenacao==='inicioMandato') && (<>{`até: ${item.dtFimFormatted}`}</>)}
                                  {(ordenacao==='fimMandato'   ) && (<>{`até: ${item.dtFimFormatted}`}</>)}
                                </em>
                              </div>
                              <div key={item.uidAdministrador.concat('adminSegundoNivel')}
                                  className='adminSegundoNivel'>
                                <span key={item.uidAdministrador.concat('info1SegundoNivel')}
                                      className='info1SegundoNivel'
                                >
                                  {(ordenacao==='administrador') && (<>{`Companhia: ${item.shortNameCompanhia}`}</>)}
                                  {(ordenacao==='grupo'        ) && (<>{item.nomeOrgao}</>)}
                                  {(ordenacao==='companhia'    ) && (<>{item.nomeAdministrador}</>)}
                                  {(ordenacao==='orgao'        ) && (<>{item.nomeAdministrador}</>)}
                                  {(ordenacao==='cargo'        ) && (<>{item.shortNameCompanhia}</>)}
                                  {(ordenacao==='inicioMandato') && (<>{item.nomeAdministrador}</>)}
                                  {(ordenacao==='fimMandato'   ) && (<>{item.nomeAdministrador}</>)}
                                </span>
                                <span key={item.uidAdministrador.concat('info2SegundoNivel')}
                                      className='info2SegundoNivel'
                                >
                                  {(ordenacao==='administrador') && (<>{`- Grupo: ${item.nomeGrupoEconomico}`}</>)}
                                  {(ordenacao==='grupo'        ) && (<>{`- ${item.nomeCargo}`}</>)}
                                  {(ordenacao==='companhia'    ) && (<></>)}
                                  {(ordenacao==='orgao'        ) && (<></>)}
                                  {(ordenacao==='cargo'        ) && (<>{`- Grupo: ${item.nomeGrupoEconomico}`}</>)}
                                  {(ordenacao==='inicioMandato') && (<></>)}
                                  {(ordenacao==='fimMandato'   ) && (<></>)}
                                </span>
                              </div>
                              <div key={item.uidAdministrador.concat('adminTerceiroNivel')}
                                  className='adminTerceiroNivel'>
                                <span key={item.uidAdministrador.concat('info1TerceiroNivel')}
                                      className='info1TerceiroNivel'
                                >
                                  {(ordenacao==='administrador') && (<>{item.nomeOrgao}</>)}
                                  {(ordenacao==='grupo'        ) && (<>{item.nomeAdministrador}</>)}
                                  {(ordenacao==='companhia'    ) && (<>{item.nomeOrgao}</>)}
                                  {(ordenacao==='orgao'        ) && (<>{`Companhia: ${item.shortNameCompanhia}`}</>)}
                                  {(ordenacao==='cargo'        ) && (<>{item.nomeAdministrador}</>)}
                                  {(ordenacao==='inicioMandato') && (<>{`Companhia: ${item.shortNameCompanhia}`}</>)}
                                  {(ordenacao==='fimMandato'   ) && (<>{`Companhia: ${item.shortNameCompanhia}`}</>)}
                                </span>
                                <span key={item.uidAdministrador.concat('info2TerceiroNivel')}
                                      className='info2TerceiroNivel'
                                >
                                  {(ordenacao==='administrador') && (<>{`- ${item.nomeCargo}`}</>)}
                                  {(ordenacao==='grupo'        ) && (<></>)}
                                  {(ordenacao==='companhia'    ) && (<>{`- ${item.nomeCargo}`}</>)}
                                  {(ordenacao==='orgao'        ) && (<>{`- Grupo: ${item.nomeGrupoEconomico}`}</>)}
                                  {(ordenacao==='cargo'        ) && (<></>)}
                                  {(ordenacao==='inicioMandato') && (<>{`- Grupo: ${item.nomeGrupoEconomico}`}</>)}
                                  {(ordenacao==='fimMandato'   ) && (<>{`- Grupo: ${item.nomeGrupoEconomico}`}</>)}
                                </span>
                              </div>
                              <div key={item.uidAdministrador.concat('adminQuartoNivel')}
                                  className='adminQuartoNivel'>
                                <span key={item.uidAdministrador.concat('info1QuartoNivel')}
                                      className='info1QuartoNivel'
                                >
                                  {(ordenacao==='administrador') && (<>{`-Mandato: De ${item.dtInicioFormatted}`}</>)}
                                  {(ordenacao==='grupo'        ) && (<>{`-Mandato: De ${item.dtInicioFormatted}`}</>)}
                                  {(ordenacao==='companhia'    ) && (<>{`-Mandato: De ${item.dtInicioFormatted}`}</>)}
                                  {(ordenacao==='orgao'        ) && (<>{`-Mandato: De ${item.dtInicioFormatted}`}</>)}
                                  {(ordenacao==='cargo'        ) && (<>{`-Mandato: De ${item.dtInicioFormatted}`}</>)}
                                  {(ordenacao==='inicioMandato') && (<>{item.nomeOrgao}</>)}
                                  {(ordenacao==='fimMandato'   ) && (<>{item.nomeOrgao}</>)}
                                </span>
                                <span key={item.uidAdministrador.concat('info2QuartoNivel')}
                                      className='info2QuartoNivel'
                                >
                                  {(ordenacao==='administrador') && (<>{`até: ${item.dtFimFormatted}`}</>)}
                                  {(ordenacao==='grupo'        ) && (<>{`até: ${item.dtFimFormatted}`}</>)}
                                  {(ordenacao==='companhia'    ) && (<>{`até: ${item.dtFimFormatted}`}</>)}
                                  {(ordenacao==='orgao'        ) && (<>{`até: ${item.dtFimFormatted}`}</>)}
                                  {(ordenacao==='cargo'        ) && (<>{`até: ${item.dtFimFormatted}`}</>)}
                                  {(ordenacao==='inicioMandato') && (<>{`- ${item.nomeCargo}`}</>)}
                                  {(ordenacao==='fimMandato'   ) && (<>{`- ${item.nomeCargo}`}</>)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div key={item.uidAdministrador.concat('botoesAdministrador')}
                              className='botoesAdministrador'>
                            {userMaster && (
                              <>
                              <button 
                                key={item.uidAdministrador.concat('botaoEdit')}
                                className='botaoAcaoAdmin'
                                onClick={() => {
                                  scrollPositionRef.current = document.getElementById("containerDadosAdministradores").scrollTop;
                                  setSelectedAdministrador(item);
                                  setExibeAlterar(true);
                                }}
                              >
                                <EditButtonIcon color='#1c1c1c'/>
                              </button>
                              <button 
                                key={item.uidAdministrador.concat('botaoDelete')}
                                className='botaoAcaoAdmin'
                                onClick={() => {
                                  scrollPositionRef.current = document.getElementById("containerDadosAdministradores").scrollTop;
                                  setSelectedAdministrador(item);
                                  setExibeExcluir(true);
                                }}
                                >
                                <DeleteButtonIcon color='#1c1c1c'/>
                              </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
