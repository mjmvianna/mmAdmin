import './usuarios.css';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, getDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db } from '../../services/firebaseConnection';
import { EditButtonIcon, DeleteButtonIcon, SortAscButtonIcon, SortDescButtonIcon } from '../../components/ButtonIcons';
import AltUsuario from '../../components/AltUsuario';
import ExcUsuario from '../../components/ExcUsuario';

function Usuarios() {
  const collectionUsuarios = collection(db, 'usuarios');

  const [loading, setLoading]           = useState(true);
  const [tabUsuarios, setTabUsuarios]   = useState([]);
  const [exibeExcluir, setExibeExcluir] = useState(false);
  const [exibeAlterar, setExibeAlterar] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  
  useEffect(() => {
    async function loadUsuarios() {
      await carregaUsuarios();
    }
    
    loadUsuarios();
    
  }, []);
  
  async function carregaUsuarios() {
    setLoading(true);
      
    const queryUsuarios = query(collectionUsuarios);
    const qDocs         = await getDocs(queryUsuarios);
    setTabUsuarios([]);
    const queryIsEmpty = qDocs.size === 0;
    
    if(!queryIsEmpty){
      let lista = [];
      
      qDocs.forEach((doc) => {
        const nome = doc.data().nome;
        lista.push({
          id    : doc.id,
          nome  : nome,
          email : doc.data().email,
          status: doc.data().status,
          indice: nome.toUpperCase(),
        });
      });
      
      const ind = 'indice';
      lista.sort((a, b) => (a[ind] > b[ind]) ? 1 : ((b[ind] > a[ind]) ? -1 : 0));
      setTabUsuarios([...lista]);
    }
    setLoading(false);
  }
  
  async function handleAlteraUsuario(uidUsuario, nomeUsuario, emailUsuario, statusUsuario) {
    try {
      await getDoc(doc(collectionUsuarios, uidUsuario))
      .then ((docSnapshot) => {
        if (docSnapshot.exists()) {
          alteraUsuario(uidUsuario, nomeUsuario, emailUsuario, statusUsuario);
        }
      });
    } catch(error) {
      console.log(`Ocorreu um erro ${error}`);
    }
  }
  
  async function alteraUsuario(uidUsuario, nomeUsuario, emailUsuario, statusUsuario) {
    await setDoc(doc(collectionUsuarios, uidUsuario), {
      email : emailUsuario,
      nome  : nomeUsuario,
      status: statusUsuario,
    })
    .then ( () => {
      toast.success('Usuário alterado com sucesso');
    });
    await carregaUsuarios();
    
    setSelectedUsuario(null);
    setExibeAlterar(false);
  }
  
  async function handleExcluiUsuario(uidUsuario) {
    try {
      const documentRef = doc(db, 'usuarios', uidUsuario);
      
      // Exclui do document usuarios
      await deleteDoc(documentRef);
      
      // Não excluido Authentication pois a exclusão deve ser feito em backend
      toast('Usuário excluído');
      await carregaUsuarios();
      
      setSelectedUsuario(null);
      setExibeExcluir(false);
    } catch (error) {
      console.log(`Ocorreu um erro ${error}`);
    }
  }

  function ascOrderUsuarios(ind) {
    setLoading(true);
    let lista = [];
    
    tabUsuarios.forEach((usuario) => {
      let indice = '';
      if ( ind === 'nome') {
        indice = usuario.nome;
      } else if (ind === 'email') {
        indice = usuario.email;
      } else if (ind === 'status') {
        indice = usuario.status.concat(usuario.nome);
      } else {
        indice = usuario.nome;
      }
      lista.push({
        uid   : usuario.uid,
        nome  : usuario.nome,
        email : usuario.email,
        status: usuario.status,
        sortIndex: indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] > b[indSort]) ? 1 : ((b[indSort] > a[indSort]) ? -1 : 0));
    setTabUsuarios([...lista]);
    setLoading(false);
  }
  
  function descOrderUsuarios(ind) {
    setLoading(true);
    let lista = [];
    
    tabUsuarios.forEach((usuario) => {
      let indice = '';
      if ( ind === 'nome') {
        indice = usuario.nome;
      } else if (ind === 'email') {
        indice = usuario.email;
      } else if (ind === 'status') {
        indice = usuario.status.concat(usuario.nome);
      } else {
        indice = usuario.nome;
      }
      lista.push({
        uid   : usuario.uid,
        nome  : usuario.nome,
        email : usuario.email,
        status: usuario.status,
        sortIndex: indice.toUpperCase(),
      });
    });
    
    const indSort = 'sortIndex';
    lista.sort((a, b) => (a[indSort] < b[indSort]) ? 1 : ((b[indSort] < a[indSort]) ? -1 : 0));
    setTabUsuarios([...lista]);
    setLoading(false);
  }
  
  if (loading) {
    return(
      <div className='containerUsuarios'>
        <h3>Usuários</h3>
        <div className='Carregando'><h3>Carregando...</h3></div>
      </div>
    );
  }

  return(
    <div className='containerUsuarios'>
      <h3>Usuários</h3>
      {tabUsuarios.length === 0 ? 
        <>
        <div className='container'>
          <h3>Não há usuário cadastrado</h3>
          <Link className='botaoNovoUsuario'
                to={'/NovoUsuario'}>
            <span>
              Novo Usuário
            </span>
          </Link>
        </div>
        </> :
        <>
          <Link className='botaoNovoUsuario'
                to={'/NovoUsuario'}>
            <span>
              Novo Usuário
            </span>
          </Link>
          { exibeAlterar && selectedUsuario && (
            <div className='altUsuario'>
              <div>
                <AltUsuario
                  altUidUsuario   ={selectedUsuario.id}
                  altNomeUsuario  ={selectedUsuario.nome}
                  altEmailUsuario ={selectedUsuario.email}
                  altStatusUsuario={selectedUsuario.status}
                  handleAlteraUsuario={handleAlteraUsuario}
                  setSelectedUsuario ={setSelectedUsuario}
                  setExibeAlterar    ={setExibeAlterar}
                />
              </div>
            </div>
          )}
          { exibeExcluir && selectedUsuario && (
            <div className='excUsuario'>
              <div>
                <ExcUsuario
                  uidUsuario   ={selectedUsuario.id}
                  nomeUsuario  ={selectedUsuario.nome}
                  emailUsuario ={selectedUsuario.email}
                  statusUsuario={selectedUsuario.status}
                  handleExcluiUsuario={handleExcluiUsuario}
                  setSelectedUsuario ={setSelectedUsuario}
                  setExibeExcluir    ={setExibeExcluir}
                />
              </div>
            </div>
          )}
          <div className='containerTabelaUsuarios'>
            <table className='tabelaUsuarios'>
              <thead>
                <tr>
                  <th scope='col'>
                    <div className='headerTabUsuarios'>
                      <span>Nome</span>
                      <div className='headerTabUsuariosButtons'>
                        <button onClick={() => ascOrderUsuarios ('nome')}><SortAscButtonIcon/></button>
                        <button onClick={() => descOrderUsuarios('nome')}><SortDescButtonIcon/></button>
                      </div>
                    </div>
                  </th>
                  <th scope='col'>
                    <div className='headerTabUsuarios'>
                      <span>E-mail</span>
                      <div className='headerTabUsuariosButtons'>
                        <button onClick={() => ascOrderUsuarios ('email')}><SortAscButtonIcon/></button>
                        <button onClick={() => descOrderUsuarios('email')}><SortDescButtonIcon/></button>
                      </div>
                    </div>
                  </th>
                  <th scope='col'>
                    <div className='headerTabUsuarios'>
                      <span>Status</span>
                      <div className='headerTabUsuariosButtons'>
                        <button onClick={() => ascOrderUsuarios ('status')}><SortAscButtonIcon/></button>
                        <button onClick={() => descOrderUsuarios('status')}><SortDescButtonIcon/></button>
                      </div>
                    </div>
                  </th>
                  <th scope='col'>#</th>
                </tr>
              </thead>
              <tbody>
                {tabUsuarios.map((item, index) => {
                  return(
                    <tr key={item.id}>
                      <td className='tdNome'   data-label='Nome:'>
                        {item.nome}
                      </td>
                      <td className='tdEmail'  data-label='E-mail:'>
                        {item.email}
                      </td>
                      <td className='tdStatus' data-label='Status:'>
                        {item.status}
                      </td>
                      <td className='tdBotoesUsuarios'>
                        <button 
                          className='botaoAcaoUsuario'
                          onClick={() => {
                            setSelectedUsuario(item);
                            setExibeAlterar(true);
                          }}
                        >
                          <EditButtonIcon color='#1c1c1c'/>
                        </button>
                        <button 
                          className='botaoAcaoUsuario'
                          onClick={() => {
                            setSelectedUsuario(item);
                            setExibeExcluir(true);
                          }}
                        >
                          <DeleteButtonIcon color='#1c1c1c'/>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      }
    </div>
  );
}

export default Usuarios;