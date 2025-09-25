 import {useParams} from 'react-router-dom';
 import Login from './login';
 import Register from './register';
 
 

 const Auth = () => {
  const { auth } = useParams();

  switch (auth) {
    case 'login':
      return <Login />;
    case 'register':
      return <Register />;
  }
};

export default Auth;