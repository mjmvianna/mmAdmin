// MÓDULO EM DESENVOLVIMENTO
// DISPONÍVEL APENAS PARA USUÁRIOS ADMIN
//
// MELHORANDO A VISUALIZAÇÃO DOS DADOS
// -DEFINIR NOVO LEIAUTE - OK
// -ENCONTRAR SOLUÇÃO PARA NOVO LEIAUTE - OK
// -PROGRAMAR TESTE PARA VERIFICAR NOVO LEIAUTE - OK
// -PROGRAMAR CARGA DOS DADOS DO BANCO DE DADOS - OK
// -PROGRAMAR ORDENAÇÃO - OK
// -PROGRAMAR FILTRO - OK
// -TIRAR O CAMPO APELIDO DO MÓDULO DE PESSOAS - OK
// -TIRAR O CAMPO APELIDO DE TODOS OS MÓDULOS QUE USAM A TABELA PESSOAS - OK
// -PROGRAMAR ALTERAÇÃO
// -PROGRAMAR EXCLUSÃO

import './teste.css';

import { useEffect, useState, useContext, useRef } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';

import { db } from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';
import { fetchPessoas } from '../../utils/utilsDb';
import { fetchGrupos } from '../../utils/utilsDb';
import { fetchCompanhias } from '../../utils/utilsDb';
import { fetchOrgaos } from '../../utils/utilsDb';
import { fetchCargos } from '../../utils/utilsDb';
import { EditButtonIcon, DeleteButtonIcon, SortAscButtonIcon, SortDescButtonIcon, PlusButtonIcon, MinusButtonIcon } from '../../components/ButtonIcons';
import IncAdministrador from '../../components/IncAdministrador';
import AltAdministrador from '../../components/AltAdministrador';
import ExcAdministrador from '../../components/ExcAdministrador';

function Teste() {
  const collectionAdministradores = collection(db, 'administradores');
  const { userMaster } = useContext(AuthContext);
  
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
  const [alteraExibicao, setAlteraExibicao] = useState(true);
  
  const [chamaTeste    , setChamaTeste    ] = useState(false);

  const scrollPositionRef = useRef(0);
  
  // Carregar primeiro tabAdministradores, que será atualizada a cada
  // inclusão, alteração ou exclusão.
  // Havendo qualquer alteração em tabAdministradores, alterar 
  // tabAdminSelect com base no filtro e na ordenação
  const [tabAdministradores   , setTabAdministradores   ] = useState([]);
  const [tabAdminSelect       , setTabAdminSelect       ] = useState([]);
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
        console.error('Error fetching tabelas:', error);
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
    fOrdenaLista(tabAdminSelect);
  },[ordenacao, ordenacaoAsc]);
  
  useEffect(() => {
    filtraTabela();
  }, [itemFiltro]);
  
  useEffect(() => {
    if (!exibeIncluir && !exibeAlterar && !exibeExcluir) {
      try {
        carregaAdministradores();
      } catch (error) {
        console.error('Error fetching administradores:', error);
      };
    }
  },[loadingTabelas, exibeIncluir, exibeAlterar, exibeExcluir]);
  
  useEffect(() => {
    filtraTabela();
  },[tabAdministradores]);
  
  useEffect(() => {
    fetchTabAdmExibicao();
  }, [tabAdminSelect]);
  
  useEffect(() => {
    if (document.getElementById("containerDadosAdministradores")) {
      const scrollVar = scrollPositionRef.current;
      document.getElementById("containerDadosAdministradores").scrollTo(
        { 
          top: scrollVar,
          behavior: "instant",
        }
      );
    }
  }, [tabAdminExibicao]);
  
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
    setTabAdminSelect([]);
    
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
          sortField = nomeAdministrador.concat(razaoSocialCompanhia).concat(nomeOrgao);
        } else if (ordenacao === 'grupo') {
          sortField = nomeGrupoEconomico.concat(razaoSocialCompanhia).concat(nomeOrgao);
        } else if (ordenacao === 'companhia') {
          sortField = razaoSocialCompanhia.concat(nomeAdministrador).concat(nomeOrgao);
        } else if (ordenacao === 'orgao') {
          sortField = nomeOrgao.concat(nomeCargo).concat(nomeAdministrador);
        } else if (ordenacao === 'cargo' ) {
          sortField = nomeCargo.concat(nomeOrgao).concat(razaoSocialCompanhia).concat(anoInicioMandato).concat(mesInicioMandato).concat(diaInicioMandato); //concat(nomeAdministrador);
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
    setTabAdminSelect([...listaOrdenada]);
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
  
  function fetchTabAdmExibicao() {
    switch (ordenacao) {
      case 'administrador':
        fetchTabAdmAdministradores();
        break;
      case 'grupo':
        fetchTabAdmGrupo();
        break;
      case 'companhia':
        fetchTabAdmCompanhia();
        break;
      case 'orgao':
        fetchTabAdmOrgao();
        break;
      case 'cargo':
        fetchTabAdmCargo();
    }
  }
  
  function fetchTabAdmAdministradores() {
    const dadosParaExibicao = [];
    let i=0;
    while (i<tabAdminSelect.length) {
      const campo1 = tabAdminSelect[i].nomeAdministrador;
      
      const vetorNivel1 = [];
      while (i<tabAdminSelect.length && 
            (campo1 === tabAdminSelect[i].nomeAdministrador)) {
        const campo2 = tabAdminSelect[i].nomeGrupoEconomico;
        
        const vetorNivel2 = [];
        while (i<tabAdminSelect.length && 
              (campo1 === tabAdminSelect[i].nomeAdministrador &&
               campo2 === tabAdminSelect[i].nomeGrupoEconomico)) {
          const campo3 = tabAdminSelect[i].razaoSocialCompanhia;
        
          const vetorNivel3 = [];
          while (i<tabAdminSelect.length && 
                (campo1 === tabAdminSelect[i].nomeAdministrador  &&
                 campo2 === tabAdminSelect[i].nomeGrupoEconomico &&
                 campo3 === tabAdminSelect[i].razaoSocialCompanhia)) {
            const campo4 = tabAdminSelect[i].nomeOrgao;
            
            const vetorNivel4 = [];
            while (i<tabAdminSelect.length && 
                  (campo1 === tabAdminSelect[i].nomeAdministrador    &&
                   campo2 === tabAdminSelect[i].nomeGrupoEconomico   &&
                   campo3 === tabAdminSelect[i].razaoSocialCompanhia && 
                   campo4 === tabAdminSelect[i].nomeOrgao)) {
              const campo5 = tabAdminSelect[i].nomeCargo;
              
              const vetorNivel5 = [];
              while (i<tabAdminSelect.length && 
                    (campo1 === tabAdminSelect[i].nomeAdministrador    &&
                     campo2 === tabAdminSelect[i].nomeGrupoEconomico   &&
                     campo3 === tabAdminSelect[i].razaoSocialCompanhia && 
                     campo4 === tabAdminSelect[i].nomeOrgao            && 
                     campo5 === tabAdminSelect[i].nomeCargo)) {
                vetorNivel5.push({
                  campoExibicao6  : 'De ' + tabAdminSelect[i].dtInicioFormatted + ' a ' + tabAdminSelect[i].dtFimFormatted,
                  uidAdministrador: tabAdminSelect[i].uidAdministrador,
                });
                i++;
              }
              
              vetorNivel4.push({
                campoExibicao5: campo5,
                exibeExibicao5: true,
                vetorExibicao5: vetorNivel5,
              });
            }
            
            vetorNivel3.push({
              campoExibicao4: campo4,
              exibeExibicao4: true,
              vetorExibicao4: vetorNivel4,
            });
          }
          
          vetorNivel2.push({
            campoExibicao3: campo3,
            exibeExibicao3: true,
            vetorExibicao3: vetorNivel3,
          });
        }
        
        vetorNivel1.push({
          campoExibicao2: 'Grupo ' + campo2,
          exibeExibicao2: true,
          vetorExibicao2: vetorNivel2,
        });
      }
      
      dadosParaExibicao.push({
        campoExibicao1: campo1,
        exibeExibicao1: true,
        vetorExibicao1: vetorNivel1,
      });
    }
    setTabAdminExibicao(dadosParaExibicao);
  }
  
  function fetchTabAdmGrupo() {
    const dadosParaExibicao = [];
    let i=0;
    while (i<tabAdminSelect.length) {
      const campo1 = tabAdminSelect[i].nomeGrupoEconomico;
      
      const vetorNivel1 = [];
      while (i<tabAdminSelect.length && 
            (campo1 === tabAdminSelect[i].nomeGrupoEconomico)) {
        const campo2 = tabAdminSelect[i].razaoSocialCompanhia;
        
        const vetorNivel2 = [];
        while (i<tabAdminSelect.length && 
              (campo1 === tabAdminSelect[i].nomeGrupoEconomico &&
               campo2 === tabAdminSelect[i].razaoSocialCompanhia)) {
          const campo3 = tabAdminSelect[i].nomeOrgao;
        
          const vetorNivel3 = [];
          while (i<tabAdminSelect.length && 
                (campo1 === tabAdminSelect[i].nomeGrupoEconomico   &&
                 campo2 === tabAdminSelect[i].razaoSocialCompanhia &&
                 campo3 === tabAdminSelect[i].nomeOrgao)) {
            const campo4 = tabAdminSelect[i].nomeCargo;
            
            const vetorNivel4 = [];
            while (i<tabAdminSelect.length && 
                  (campo1 === tabAdminSelect[i].nomeGrupoEconomico   &&
                   campo2 === tabAdminSelect[i].razaoSocialCompanhia &&
                   campo3 === tabAdminSelect[i].nomeOrgao            && 
                   campo4 === tabAdminSelect[i].nomeCargo)) {
              const campo5 = tabAdminSelect[i].nomeAdministrador;
              
              const vetorNivel5 = [];
              while (i<tabAdminSelect.length && 
                    (campo1 === tabAdminSelect[i].nomeGrupoEconomico   &&
                     campo2 === tabAdminSelect[i].razaoSocialCompanhia &&
                     campo3 === tabAdminSelect[i].nomeOrgao            && 
                     campo4 === tabAdminSelect[i].nomeCargo            &&
                     campo5 === tabAdminSelect[i].nomeAdministrador)) {
               vetorNivel5.push({
                  campoExibicao6: 'De ' + tabAdminSelect[i].dtInicioFormatted + ' a ' + tabAdminSelect[i].dtFimFormatted,
                  uidAdministrador: tabAdminSelect[i].uidAdministrador,
                });
                i++;
              }
              
              vetorNivel4.push({
                campoExibicao5: campo5,
                exibeExibicao5: true,
                vetorExibicao5: vetorNivel5,
              });
            }
            
            vetorNivel3.push({
              campoExibicao4: campo4,
              exibeExibicao4: true,
              vetorExibicao4: vetorNivel4,
            });
          }
          
          vetorNivel2.push({
            campoExibicao3: campo3,
            exibeExibicao3: true,
            vetorExibicao3: vetorNivel3,
          });
        }
        
        vetorNivel1.push({
          campoExibicao2: campo2,
          exibeExibicao2: true,
          vetorExibicao2: vetorNivel2,
        });
      }
      
      dadosParaExibicao.push({
        campoExibicao1: 'Grupo ' + campo1,
        exibeExibicao1: true,
        vetorExibicao1: vetorNivel1,
      });
    }
    setTabAdminExibicao(dadosParaExibicao);
  }
  
  function fetchTabAdmCompanhia() {
    const dadosParaExibicao = [];
    let i=0;
    while (i<tabAdminSelect.length) {
      const campo1 = tabAdminSelect[i].razaoSocialCompanhia;
      
      const vetorNivel1 = [];
      while (i<tabAdminSelect.length && 
            (campo1 === tabAdminSelect[i].razaoSocialCompanhia)) {
        const campo2 = tabAdminSelect[i].nomeGrupoEconomico;

        const vetorNivel2 = [];
        while (i<tabAdminSelect.length && 
              (campo1 === tabAdminSelect[i].razaoSocialCompanhia &&
               campo2 === tabAdminSelect[i].nomeGrupoEconomico)) {
          const campo3 = tabAdminSelect[i].nomeAdministrador;
        
          const vetorNivel3 = [];
          while (i<tabAdminSelect.length && 
                (campo1 === tabAdminSelect[i].razaoSocialCompanhia &&
                 campo2 === tabAdminSelect[i].nomeGrupoEconomico   &&
                 campo3 === tabAdminSelect[i].nomeAdministrador)) {
            const campo4 = tabAdminSelect[i].nomeOrgao;

            const vetorNivel4 = [];
            while (i<tabAdminSelect.length && 
                  (campo1 === tabAdminSelect[i].razaoSocialCompanhia &&
                   campo2 === tabAdminSelect[i].nomeGrupoEconomico   &&
                   campo3 === tabAdminSelect[i].nomeAdministrador    && 
                   campo4 === tabAdminSelect[i].nomeOrgao)) {
              const campo5 = tabAdminSelect[i].nomeCargo;
              
              const vetorNivel5 = [];
              while (i<tabAdminSelect.length && 
                    (campo1 === tabAdminSelect[i].razaoSocialCompanhia &&
                     campo2 === tabAdminSelect[i].nomeGrupoEconomico   &&
                     campo3 === tabAdminSelect[i].nomeAdministrador    && 
                     campo4 === tabAdminSelect[i].nomeOrgao            &&
                     campo5 === tabAdminSelect[i].nomeCargo)) {
               vetorNivel5.push({
                  campoExibicao6: 'De ' + tabAdminSelect[i].dtInicioFormatted + ' a ' + tabAdminSelect[i].dtFimFormatted,
                  uidAdministrador: tabAdminSelect[i].uidAdministrador,
                });
                i++;
              }
              
              vetorNivel4.push({
                campoExibicao5: campo5,
                exibeExibicao5: true,
                vetorExibicao5: vetorNivel5,
              });
            }
            
            vetorNivel3.push({
              campoExibicao4: campo4,
              exibeExibicao4: true,
              vetorExibicao4: vetorNivel4,
            });
          }
          
          vetorNivel2.push({
            campoExibicao3: campo3,
            exibeExibicao3: true,
            vetorExibicao3: vetorNivel3,
          });
        }
        
        vetorNivel1.push({
          campoExibicao2: 'Grupo ' + campo2,
          exibeExibicao2: true,
          vetorExibicao2: vetorNivel2,
        });
      }
      
      dadosParaExibicao.push({
        campoExibicao1: campo1,
        exibeExibicao1: true,
        vetorExibicao1: vetorNivel1,
      });
    }
    setTabAdminExibicao(dadosParaExibicao);
  }
  
  function fetchTabAdmOrgao() {
    const dadosParaExibicao = [];
    let i=0;
    while (i<tabAdminSelect.length) {
      const campo1 = tabAdminSelect[i].nomeOrgao;
      
      const vetorNivel1 = [];
      while (i<tabAdminSelect.length && 
            (campo1 === tabAdminSelect[i].nomeOrgao)) {
        const campo2 = tabAdminSelect[i].nomeCargo;

        const vetorNivel2 = [];
        while (i<tabAdminSelect.length && 
              (campo1 === tabAdminSelect[i].nomeOrgao &&
               campo2 === tabAdminSelect[i].nomeCargo)) {
          const campo3 = tabAdminSelect[i].nomeAdministrador;
        
          const vetorNivel3 = [];
          while (i<tabAdminSelect.length && 
                (campo1 === tabAdminSelect[i].nomeOrgao &&
                 campo2 === tabAdminSelect[i].nomeCargo &&
                 campo3 === tabAdminSelect[i].nomeAdministrador)) {
            const campo4 = tabAdminSelect[i].razaoSocialCompanhia;
    
            const vetorNivel4 = [];
            while (i<tabAdminSelect.length && 
                  (campo1 === tabAdminSelect[i].nomeOrgao         &&
                   campo2 === tabAdminSelect[i].nomeCargo         &&
                   campo3 === tabAdminSelect[i].nomeAdministrador && 
                   campo4 === tabAdminSelect[i].razaoSocialCompanhia)) {
              const campo5 = tabAdminSelect[i].nomeGrupoEconomico;
              
              const vetorNivel5 = [];
              while (i<tabAdminSelect.length && 
                    (campo1 === tabAdminSelect[i].nomeOrgao            &&
                     campo2 === tabAdminSelect[i].nomeCargo            &&
                     campo3 === tabAdminSelect[i].nomeAdministrador    && 
                     campo4 === tabAdminSelect[i].razaoSocialCompanhia &&
                     campo5 === tabAdminSelect[i].nomeGrupoEconomico)) {
               vetorNivel5.push({
                  campoExibicao6: 'De ' + tabAdminSelect[i].dtInicioFormatted + ' a ' + tabAdminSelect[i].dtFimFormatted,
                  uidAdministrador: tabAdminSelect[i].uidAdministrador,
                });
                i++;
              }
              
              vetorNivel4.push({
                campoExibicao5: 'Grupo ' + campo5,
                exibeExibicao5: true,
                vetorExibicao5: vetorNivel5,
              });
            }
            
            vetorNivel3.push({
              campoExibicao4: campo4,
              exibeExibicao4: true,
              vetorExibicao4: vetorNivel4,
            });
          }
          
          vetorNivel2.push({
            campoExibicao3: campo3,
            exibeExibicao3: true,
            vetorExibicao3: vetorNivel3,
          });
        }
        
        vetorNivel1.push({
          campoExibicao2: campo2,
          exibeExibicao2: true,
          vetorExibicao2: vetorNivel2,
        });
      }
      
      dadosParaExibicao.push({
        campoExibicao1: campo1,
        exibeExibicao1: true,
        vetorExibicao1: vetorNivel1,
      });
    }
    setTabAdminExibicao(dadosParaExibicao);
  }
  
  function fetchTabAdmCargo() {
    const dadosParaExibicao = [];
    let i=0;
    while (i<tabAdminSelect.length) {
      const campo1 = tabAdminSelect[i].nomeCargo;
      
      const vetorNivel1 = [];
      while (i<tabAdminSelect.length && 
            (campo1 === tabAdminSelect[i].nomeCargo)) {
        const campo2 = tabAdminSelect[i].nomeOrgao;

        const vetorNivel2 = [];
        while (i<tabAdminSelect.length && 
              (campo1 === tabAdminSelect[i].nomeCargo &&
               campo2 === tabAdminSelect[i].nomeOrgao)) {
          const campo3 = tabAdminSelect[i].razaoSocialCompanhia;
        
          const vetorNivel3 = [];
          while (i<tabAdminSelect.length && 
                (campo1 === tabAdminSelect[i].nomeCargo &&
                 campo2 === tabAdminSelect[i].nomeOrgao &&
                 campo3 === tabAdminSelect[i].razaoSocialCompanhia)) {
            const campo4 = tabAdminSelect[i].nomeGrupoEconomico;
    
            const vetorNivel4 = [];
            while (i<tabAdminSelect.length && 
                  (campo1 === tabAdminSelect[i].nomeCargo            &&
                   campo2 === tabAdminSelect[i].nomeOrgao            &&
                   campo3 === tabAdminSelect[i].razaoSocialCompanhia && 
                   campo4 === tabAdminSelect[i].nomeGrupoEconomico)) {
              const campo5 = tabAdminSelect[i].nomeAdministrador;
              
              const vetorNivel5 = [];
              while (i<tabAdminSelect.length && 
                    (campo1 === tabAdminSelect[i].nomeCargo            &&
                     campo2 === tabAdminSelect[i].nomeOrgao            &&
                     campo3 === tabAdminSelect[i].razaoSocialCompanhia && 
                     campo4 === tabAdminSelect[i].nomeGrupoEconomico   &&
                     campo5 === tabAdminSelect[i].nomeAdministrador)) {
               vetorNivel5.push({
                  campoExibicao6: 'De ' + tabAdminSelect[i].dtInicioFormatted + ' a ' + tabAdminSelect[i].dtFimFormatted,
                  uidAdministrador: tabAdminSelect[i].uidAdministrador,
                });
                i++;
              }
              
              vetorNivel4.push({
                campoExibicao5: campo5,
                exibeExibicao5: true,
                vetorExibicao5: vetorNivel5,
              });
            }
            
            vetorNivel3.push({
              campoExibicao4: 'Grupo ' + campo4,
              exibeExibicao4: true,
              vetorExibicao4: vetorNivel4,
            });
          }
          
          vetorNivel2.push({
            campoExibicao3: campo3,
            exibeExibicao3: true,
            vetorExibicao3: vetorNivel3,
          });
        }
        
        vetorNivel1.push({
          campoExibicao2: campo2,
          exibeExibicao2: true,
          vetorExibicao2: vetorNivel2,
        });
      }
      
      dadosParaExibicao.push({
        campoExibicao1: campo1,
        exibeExibicao1: true,
        vetorExibicao1: vetorNivel1,
      });
    }
    setTabAdminExibicao(dadosParaExibicao);
  }
  
  function exibeDadosAdministradores() {
    return(
      tabAdminExibicao.map((item1, index1) => {
        return(
          <div key={item1.campoExibicao1.concat('admDivPrincipal')}
              className='admDivPrincipalTeste'>
            <div key={item1.campoExibicao1.concat('adminPrimeiroNivel')}
                className='adminPrimeiroNivelTeste'>
              <div key={item1.campoExibicao1.concat('adminNivelExibe')}
                className='adminNivelExibe'>
                <strong key={item1.campoExibicao1.concat('info1PrimeiroNivel')}
                        className='info1PrimeiroNivelTeste'
                >
                  {item1.campoExibicao1}
                </strong>
                <button 
                  key={item1.campoExibicao1.concat('botaoExibeNivelAbaixo')}
                  className='botaoPlusMinusTeste'
                  onClick={() => {
                    item1.exibeExibicao1 = !item1.exibeExibicao1;
                    setAlteraExibicao(!alteraExibicao);
                  }}
                  >
                  {item1.exibeExibicao1 ? <MinusButtonIcon color='#1c1c1c'/> : <PlusButtonIcon color='#1c1c1c'/>}
                </button>
              </div>
              {item1.exibeExibicao1 && item1.vetorExibicao1.map((item2, index2) => {
                return(
                  <>
                    <div key={item2.campoExibicao2.concat('adminSegundoNivel')}
                      className='adminSegundoNivelTeste'>
                      <span key={item2.campoExibicao2.concat('info1SegundoNivel')}
                                className='info1SegundoNivelTeste'
                      >
                        {item2.campoExibicao2}
                      </span>
                      <button 
                        key={item2.campoExibicao2.concat('botaoExibeNivelAbaixo')}
                        className='botaoPlusMinusTeste'
                        onClick={() => {
                          item2.exibeExibicao2 = !item2.exibeExibicao2;
                          setAlteraExibicao(!alteraExibicao);
                        }}
                        >
                        {item2.exibeExibicao2 ? <MinusButtonIcon color='#1c1c1c'/> : <PlusButtonIcon color='#1c1c1c'/>}
                      </button>
                    </div>
                    {item2.exibeExibicao2 && item2.vetorExibicao2.map((item3, index3) => {
                      return(
                        <>
                          <div key={item3.campoExibicao3.concat('adminNivelExibe')}
                            className='adminNivelExibe'>
                            <span key={item3.campoExibicao3.concat('info1TerceiroNivel')}
                                      className='info1TerceiroNivelTeste'
                            >
                              {item3.campoExibicao3}
                            </span>
                            <button 
                              key={item3.campoExibicao3.concat('botaoExibeNivelAbaixo')}
                              className='botaoPlusMinusTeste'
                              onClick={() => {
                                item3.exibeExibicao3 = !item3.exibeExibicao3;
                                setAlteraExibicao(!alteraExibicao);
                              }}
                              >
                              {item3.exibeExibicao3 ? <MinusButtonIcon color='#1c1c1c'/> : <PlusButtonIcon color='#1c1c1c'/>}
                            </button>
                          </div>
                          {item3.exibeExibicao3 && item3.vetorExibicao3.map((item4, index4) => {
                            return(
                              <>
                                <div key={item4.campoExibicao4.concat('adminNivelExibe')}
                                  className='adminNivelExibe'>
                                  <span key={item4.campoExibicao4.concat('info1QuartoNivel')}
                                            className='info1QuartoNivelTeste'
                                  >
                                    {item4.campoExibicao4}
                                  </span>
                                  <button 
                                    key={item4.campoExibicao4.concat('botaoExibeNivelAbaixo')}
                                    className='botaoPlusMinusTeste'
                                    onClick={() => {
                                      item4.exibeExibicao4 = !item4.exibeExibicao4;
                                      setAlteraExibicao(!alteraExibicao);
                                    }}
                                    >
                                    {item4.exibeExibicao4 ? <MinusButtonIcon color='#1c1c1c'/> : <PlusButtonIcon color='#1c1c1c'/>}
                                  </button>
                                </div>
                                {item4.exibeExibicao4 && item4.vetorExibicao4.map((item5, index5) => {
                                  return(
                                    <>
                                      <div key={item5.campoExibicao5.concat('adminNivelExibe')}
                                        className='adminNivelExibe'>
                                        <span key={item5.campoExibicao5.concat('info1QuintoNivel')}
                                                  className='info1QuintoNivelTeste'
                                        >
                                          {item5.campoExibicao5}
                                        </span>
                                        <button 
                                          key={item5.campoExibicao5.concat('botaoExibeNivelAbaixo')}
                                          className='botaoPlusMinusTeste'
                                          onClick={() => {
                                            item5.exibeExibicao5 = !item5.exibeExibicao5;
                                            setAlteraExibicao(!alteraExibicao);
                                          }}
                                          >
                                          {item5.exibeExibicao5 ? <MinusButtonIcon color='#1c1c1c'/> : <PlusButtonIcon color='#1c1c1c'/>}
                                        </button>
                                      </div>
                                      {item5.exibeExibicao5 && item5.vetorExibicao5.map((item6, index6) => {
                                        return(
                                          <>
                                            <div key={item6.campoExibicao6.concat('adminSextoNivel')}
                                              className='adminSextoNivelTeste'>
                                              <span key={item6.campoExibicao6.concat('info1SextoNivel')}
                                                        className='info1SextoNivelTeste'
                                              >
                                                {item6.campoExibicao6}
                                              </span>
                                              <div key={item6.campoExibicao6.concat('botoesAdministrador')}
                                                  className='botoesAdministradorTeste'>
                                                {userMaster && (
                                                  <>
                                                  <button 
                                                    key={item6.campoExibicao6.concat('botaoEdit')}
                                                    className='botaoAcaoAdminTeste'
                                                    onClick={() => {
                                                      scrollPositionRef.current = document.getElementById("containerDadosAdministradores").scrollTop;
                                                      setSelectedAdministrador(item6.uidAdministrador);
                                                      setExibeAlterar(true);
                                                    }}
                                                  >
                                                    <EditButtonIcon color='#1c1c1c'/>
                                                  </button>
                                                  <button 
                                                    key={item6.campoExibicao6.concat('botaoDelete')}
                                                    className='botaoAcaoAdminTeste'
                                                    onClick={() => {
                                                      scrollPositionRef.current = document.getElementById("containerDadosAdministradores").scrollTop;
                                                      setSelectedAdministrador(item6.uidAdministrador);
                                                      setExibeExcluir(true);
                                                    }}
                                                    >
                                                    <DeleteButtonIcon color='#1c1c1c'/>
                                                  </button>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      )}
                                    </>
                                  )}
                                )}
                              </>
                            )}
                          )}
                        </>
                      )}
                    )}
                  </>
                )}
              )}
            </div>
          </div>
        );
      })
    );
  }

  return(
    <div className='containerHomeTeste'>
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
                    altUidAdministrador = {selectedAdministrador}
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
                    excUidAdministrador = {selectedAdministrador}
                    setSelectedAdministrador = {setSelectedAdministrador}
                    setExibeExcluir          = {setExibeExcluir}
                  />
                </div>
              </div>
            </>
          )}
          { !exibeIncluir && !exibeExcluir && !exibeAlterar && (
            <>
              <div className='headerAdministradoresTeste'>
                <div className='headerTituloIncluiTeste'>
                  {/*<h3>Administradores</h3>*/}
                  {userMaster && 
                  (<>
                    <button 
                      className='botaoNovoAdministradorTeste'
                      onClick={() => {
                        scrollPositionRef.current = document.getElementById("containerDadosAdministradores").scrollTop;
                        setExibeIncluir(true);
                      }}
                    >
                      Novo Registro
                    </button>
                  </>)
                  }
                </div>
                {<div className='headerBoxesTeste'>
                  <div className='OrdenAdministradoresTeste'>
                    <small>Ordenação</small>
                    <select
                      className='selOptionsAdministradorTeste'
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
                    </select>
                    <div className='botOrdenAdministradorTeste'>
                      <div className='botAscOrdenAdministradorTeste'>
                        <button onClick={() => {
                            //scrollPositionRef.current = 0;
                            scrollPositionRef.current = document.getElementById("containerDadosAdministradores").scrollTop;
                            setOrdenacaoAsc(true)
                          }}>
                          <SortAscButtonIcon/>
                        </button>
                      </div>
                      <div className='botAscOrdenAdministradorTeste'>
                        <button onClick={() => {
                            //scrollPositionRef.current = 0;
                            scrollPositionRef.current = document.getElementById("containerDadosAdministradores").scrollTop;
                            setOrdenacaoAsc(false)
                          }}>
                          <SortDescButtonIcon/>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className='filtraAdministradoresTeste'>
                    <small>Filtro</small>
                    <select
                      className='selOptionsAdministradorTeste'
                      id='selFiltroAdministrador'
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                    >
                      <option key='filt1Vazio'     value=''             >Selecione um filtro</option>
                      <option key='filt1Admin'     value='administrador'>Administrador</option>
                      <option key='filt1Grupo'     value='grupo'        >Grupo Econômico</option>
                      <option key='filt1Companhia' value='companhia'    >Companhia</option>
                      <option key='filt1Orgao'     value='orgao'        >Órgão da Administração</option>
                      <option key='filt1Cargo'     value='cargo'        >Cargo</option>
                    </select>
                    <div className='selFiltroAdministradorTeste'>
                      <select
                        className='selOptionsAdministradorTeste'
                        id='selItemFiltroAdministrador'
                        value={itemFiltro}
                        onChange={(e) => setItemFiltro(e.target.value)}
                      >
                        <option key='filt2Vazio'   value=''>
                          {(filtro === '' ? 'Selecione um filtro acima' : 'Selecione um item a filtrar')}
                        </option>
                        {conteudoFiltro.map((item, index) => {
                          return(<option key={item.uidFiltro} value={item.uidFiltro}>{item.nomeFiltro}</option>)
                        })}
                      </select>
                    </div>
                    <div className='botOrdenAdministradorTeste'>
                      <button onClick={cancelaFiltroTabela}>Cancelar</button>
                    </div>
                  </div>
                </div>}
              </div>
              <div 
                className='containerDadosAdministradoresTeste'
                id='containerDadosAdministradores'>
                { tabAdminExibicao.length === 0 ? (
                  <>
                    <div className='tabelaVaziaTeste'>
                      <h4>Não há Administrador cadastrado para o filtro selecionado</h4>
                    </div>
                  </>
                ) : (
                  <>
                    {exibeDadosAdministradores()}
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

export default Teste;
