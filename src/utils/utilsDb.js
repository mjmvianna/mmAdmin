import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConnection';

export async function fetchPessoas() {
  const queryCollection = collection(db, 'pessoas');
  const querySnapshot = await getDocs(queryCollection);
  const queryIsEmpty = querySnapshot.size === 0;
  
  if (!queryIsEmpty) {
    let lista = [];
    
    querySnapshot.forEach((doc) => {
      lista.push({
        uidPessoa    : doc.id,
        nomePessoa   : doc.data().nomePessoa,
        apelidoPessoa: doc.data().apelidoPessoa,
        indiceData   : doc.data().nomePessoa.toUpperCase(),
      });
    });
    
    const ind = 'indiceData';
    lista = [...lista].sort((a, b) => (a[ind] > b[ind] ? 1 : b[ind] > a[ind] ? -1 : 0));
    return lista;
  } else {
    return [];
  }
}

export async function fetchGrupos() {
  const queryCollection = collection(db, 'grupos');
  const querySnapshot = await getDocs(queryCollection);
  const queryIsEmpty = querySnapshot.size === 0;
  
  if (!queryIsEmpty) {
    let lista = [];
    
    querySnapshot.forEach((doc) => {
      lista.push({
        uidGrupo  : doc.id,
        nomeGrupo : doc.data().nomeGrupo,
        indiceData: doc.data().nomeGrupo.toUpperCase(),
      });
    });
    
    const ind = 'indiceData';
    lista = [...lista].sort((a, b) => (a[ind] > b[ind] ? 1 : b[ind] > a[ind] ? -1 : 0));
    return lista;
  } else {
    return [];
  }
}

export async function fetchCompanhias() {
  let tabGrupos = [];
  try {
    tabGrupos = await fetchGrupos();
  } catch (error) {
    console.error('Error fetching grupos:', error);
  };
  
  function fNomeGrupo(uidGrupo) {
    const indGrupo = tabGrupos.findIndex((element) => element.uidGrupo === uidGrupo);
    if (indGrupo !== -1) {
      return tabGrupos[indGrupo].nomeGrupo;
    } else {
      return '* erro *';
    }
  }
  
  const queryCollection = collection(db, 'companhias');
  const querySnapshot = await getDocs(queryCollection);
  const queryIsEmpty = querySnapshot.size === 0;
  
  if (!queryIsEmpty) {
    let lista = [];
    
    querySnapshot.forEach((doc) => {
      lista.push({
        uidCompanhia: doc.id,
        razaoSocial : doc.data().razaoSocial,
        shortName   : doc.data().shortName,
        uidGrupoEconomico : doc.data().grupoEconomico,
        nomeGrupoEconomico: fNomeGrupo(doc.data().grupoEconomico),
        indiceData  : doc.data().razaoSocial.toUpperCase(),
      });
    });
    
    const ind = 'indiceData';
    lista = [...lista].sort((a, b) => (a[ind] > b[ind] ? 1 : b[ind] > a[ind] ? -1 : 0));
    return lista;
  } else {
    return [];
  }
}

export async function fetchOrgaos() {
  const queryCollection = collection(db, 'orgaos');
  const querySnapshot = await getDocs(queryCollection);
  const queryIsEmpty = querySnapshot.size === 0;
  
  if (!queryIsEmpty) {
    let lista = [];
    
    querySnapshot.forEach((doc) => {
      lista.push({
        uidOrgao  : doc.id,
        nomeOrgao : doc.data().nomeOrgao,
        siglaOrgao: doc.data().siglaOrgao,
        indiceData: doc.data().nomeOrgao.toUpperCase(),
      });
    });
    
    const ind = 'indiceData';
    lista = [...lista].sort((a, b) => (a[ind] > b[ind] ? 1 : b[ind] > a[ind] ? -1 : 0));
    return lista;
  } else {
    return [];
  }
}

export async function fetchCargos() {
  const queryCollection = collection(db, 'cargos');
  const querySnapshot = await getDocs(queryCollection);
  const queryIsEmpty = querySnapshot.size === 0;
  
  if (!queryIsEmpty) {
    let lista = [];
    
    querySnapshot.forEach((doc) => {
      lista.push({
        uidCargo  : doc.id,
        nomeCargo : doc.data().nomeCargo,
        indiceData: doc.data().nomeCargo.toUpperCase(),
      });
    });
    
    const ind = 'indiceData';
    lista = [...lista].sort((a, b) => (a[ind] > b[ind] ? 1 : b[ind] > a[ind] ? -1 : 0));
    return lista;
  } else {
    return [];
  }
}
