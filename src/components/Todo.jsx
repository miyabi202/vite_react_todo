import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
const { VITE_APP_HOST } = import.meta.env;

function Todo() {
  const navigate = useNavigate();
  const navItems = ["全部", "待完成", "已完成"];
  const [nickname, setNickname] = useState("");
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [currStatus, setCurrStatus]= useState("全部");
  const [currTodos, setCurrTodos] = useState([]);
 // 初始化頁面時，驗證身份並取得待辦事項列表
  useEffect(() => {
    const token = document.cookie.split('; ').find((row) => row.startsWith('todo='))?.split('=')[1];
    axios.defaults.headers.common['Authorization'] = token;
    checkOut();
    getTodoList();
  }, []);
 // 監聽 currStatus 的變化，篩選對應狀態的待辦事項
  useEffect(() => {
    const newTodos = todos.filter(todo => currStatus === "待完成" ? !todo.status : (currStatus === "已完成" ? todo.status : todo));
      setCurrTodos(newTodos);
  }, [currStatus]);

  const checkOut = async() => {
    try {
      const res = await axios.get(`${VITE_APP_HOST}/users/checkout`);
      setNickname(res.data.nickname);
    } catch (err) {
      Swal.fire({
        title: '驗證失效',
        text: "請重新登入",
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      }).then(() => { navigate('/'); });
    }
  }
// 取得待辦事項列表的函數
  const getTodoList = async() => {
    try {
      const res = await axios.get(`${VITE_APP_HOST}/todos`);
      setTodos(res.data.data);

      const newTodos = res.data.data.filter(todo => currStatus === "待完成" ? !todo.status : (currStatus === "已完成" ? todo.status : todo));
      setCurrTodos(newTodos);
    } catch (err) {
      Swal.fire({
        title: '取得待辦事項失敗',
        text: err.response.data.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      });
    }
  }
// 新增待辦事項的函數
  const addTodo = async(e) => {
    e.preventDefault();
    const todo = { content: newTodo };
    try {
      await axios.post(`${VITE_APP_HOST}/todos`, todo);
      setNewTodo("");
      getTodoList();
    } catch (err) {
      Swal.fire({
        title: '新增待辦事項失敗',
        text: err.response.data.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      }).then(() => { getTodoList(); });
    }
  }

  const deleteTodo = async(id) => {
    try {
      await axios.delete(`${VITE_APP_HOST}/todos/${id}`);

      getTodoList();
    } catch (err) {
      Swal.fire({
        title: '刪除待辦事項失敗',
        text: err.response.data.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      }).then(() => { getTodoList(); });
    }
  }

  const toggleStatus = async(id) => {
    try {
      await axios.patch(`${VITE_APP_HOST}/todos/${id}/toggle`, {});

      getTodoList();
    } catch (err) {
      Swal.fire({
        title: '待辦事項狀態變更失敗',
        text: err.response.data.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      }).then(() => { getTodoList(); });
    }
  }

  const handleLogout = async() => {
    try {
      await axios.post(`${VITE_APP_HOST}/users/sign_out`, {});
      Swal.fire({
        title: '登出成功',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000
      }).then(() => { navigate('/'); });
    } catch (err) {
      Swal.fire({
        title: '登出失敗',
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      });
    }
  }

  const clearTodo = async() => {
    const deleteTodos = todos.filter(todo => todo.status);
    if (deleteTodos.length === 0) { return; }

    try {
      const swalRes = await Swal.fire({
        title: '確定清除已完成項目?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否'
      });

      if (!swalRes.isConfirmed) { return; }
      for (let i = 0; i < deleteTodos.length; i++) {
        await axios.delete(`${VITE_APP_HOST}/todos/${deleteTodos[i].id}`);
      }
      Swal.fire({
        title: '清除項目成功',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000
      }).then(() => { getTodoList(); });
    } catch (err) {
      Swal.fire({
        title: '刪除項目失敗',
        text: err.response.data.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      });
    }
  }

  return (<>
    <div id="todoListPage" className="bg-half">
      <nav>
        <a href="#"><img className="logoImg" src="https://raw.githubusercontent.com/jesswu1551/react_todo/main/src/assets/logo.png" alt="logoImg" /></a>
        <ul>
          <li className="todo_sm"><a><span>{nickname}的代辦</span></a></li>
          <li><a onClick={handleLogout}>登出</a></li>
        </ul>
      </nav>
      <div className="conatiner todoListPage vhContainer">
        <div className="todoList_Content">
          <div className="inputBox">
            <input type="text" value={newTodo} placeholder="新增待辦事項"
                   onChange={(e) => { setNewTodo(e.target.value); }}
                   onKeyDown={(e) => { if (e.key === "Enter") { addTodo(e); } }} />
              <a onClick={(e) => addTodo(e)}><i className="fa fa-plus"></i></a>
          </div>
          {
            todos.length ? (
              <div className="todoList_list">
                <ul className="todoList_tab">
                  {
                    navItems.map(navItem => (
                      <li key={navItem}>
                        <a className={currStatus === navItem ? "active" : ""} onClick={(e) => { setCurrStatus(e.target.text); }}>{navItem}</a>
                      </li>
                    ))
                  }
                </ul>
                <div className="todoList_items">
                  <ul className="todoList_item">
                    {
                      currTodos.map(todo => {
                        return (
                          <li key={todo.id}>
                            <label className="todoList_label">
                              <input className="todoList_input" type="checkbox"
                                     value={todo.status} checked={todo.status}
                                     onChange={() => toggleStatus(todo.id)} />
                              <span>{todo.content}</span>
                            </label>
                            <a onClick={() => deleteTodo(todo.id)}>
                              <i className="fa fa-times"></i>
                            </a>
                          </li>)
                      })
                    }
                  </ul>
                  <div className="todoList_statistics">
                    <p> {todos.filter(todo => !todo.status).length} 個待完成項目</p>
                    <a onClick={clearTodo}>清除已完成項目</a>
                  </div>
                </div>
              </div>) : (<div style={{textAlign: "center", margin: "60px 0"}}>目前尚無待辦事項</div>)
          }
        </div>
      </div>
    </div>
  </>)
}

export default Todo
