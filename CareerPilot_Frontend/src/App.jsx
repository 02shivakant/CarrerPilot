import {BrowserRouter , Routes, Route , Navigate} from 'react-router-dom'

function Home(){
  return (
    <div>
      <h1>CareerPilot</h1>
      <p>Your career journey starts here.</p>
    </div>
  );
}

function Login(){
  return <h1> Login Page</h1>
}

function Register(){
  return <h1>Register Page</h1>
}

function App(){
  return (
    <BrowserRouter>
          <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/register' element={<Register/>} />
              <Route path='*' element={<Navigate to="/" />} />
          </Routes>
    </BrowserRouter>
  );
}
export default App;