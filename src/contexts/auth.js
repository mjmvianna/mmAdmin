import { useState, createContext } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { auth, db } from '../services/firebaseConnection';

// Cria o contexto AuthContext
export const AuthContext = createContext({});

// Cria o provedor do contexto AuthContext
function AuthProvider({ children }){
  const [user        , setUser        ] = useState(null);
  const [userAdmin   , setUserAdmin   ] = useState(false);
  const [userMaster  , setUserMaster  ] = useState(false);
  const [loadingAuth , setLoadingAuth ] = useState(false);
  
  const navigate = useNavigate();
  
  // Por definição, o status do usuário deve ser 'admin', 'master' ou 'consulta'
  // 'admin' tem acesso a tudo, 'master' tem acesso a quase tudo
  // 'consulta' é atribuído somente no cadastro e não precisa
  // ser tratado, pois é o default.
  const statusAdmin    = 'admin';
  const statusMaster   = 'master';
  
  async function signIn(email, password){
    setLoadingAuth(true);
    
    await signInWithEmailAndPassword(auth, email, password)
    .then( async (value) => {
      let uid = value.user.uid;
      
      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);
      
      let data = {
        uid   : uid,
        nome  : docSnap.data().nome,
        email : value.user.email,
        status: docSnap.data().status,
      };
      
      setUser(data);
      setUserAdmin (data.status === statusAdmin );
      setUserMaster(data.status === statusMaster || data.status === statusAdmin); // todo admin é master também
      setLoadingAuth(false);
      navigate('/Home');
    })
    .catch((error) => {
      console.log(error);
      toast.error('Usuário não cadastrado ou senha inválida');
      setLoadingAuth(false);
    });
  }
  
  // Cadastrar um novo user
  async function signUp(email, password, name, statusUsuario){
    setLoadingAuth(true);
    
    await createUserWithEmailAndPassword(auth, email, password)
    .then( async (value) => {
      let uid = value.user.uid;
      
      await setDoc(doc(db, "usuarios", uid), {
        nome  : name,
        email : email,
        status: statusUsuario,
      })
      .then( () => {
        let data = {
          uid   : uid,
          nome  : name,
          email : value.user.email,
          status: statusUsuario,
        };
        
        setUser(data);
        toast('Usuário cadastrado com sucesso');
        setLoadingAuth(false);
        
        // Se for usuário admin, navega para /Usuarios, else para /Home
        if (userAdmin) {
          navigate('/Usuarios');
        } else {
          navigate('/Home');
        }
      })
      .catch((error) => {
        toast.error(`Erro na inclusão do usuário: ${error}`);
        setLoadingAuth(false);
      });
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('E-mail já cadastrado');
      } else {
        if (error.code === 'auth/invalid-email') {
          toast.error(`E-mail inválido`);
        } else {
          toast.error(`Erro na inclusão do e-mail ${error}`);
        }
      }
      setLoadingAuth(false);
    })
  }
  
  async function logOut(){
    await signOut(auth);
    setUserAdmin(false);
    setUserMaster(false);
    setUser(null);
  }
  
  return(
    <AuthContext.Provider 
      value={{
        signed: !!user,
        user,
        userAdmin,
        userMaster,
        signIn,
        signUp,
        logOut,
        loading: loadingAuth,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
