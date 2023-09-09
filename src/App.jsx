import { HashRouter, Route, Routes } from 'react-router-dom';
import SignUp from "./components/SignUp"
import SignIn from "./components/SignIn"
import Todo from "./components/Todo"
function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<SignIn />}></Route>
          <Route path="/signUp" element={<SignUp />}></Route>
          <Route path="/todo" element={<Todo />}></Route>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
