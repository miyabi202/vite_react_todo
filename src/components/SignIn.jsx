import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
const { VITE_APP_HOST } = import.meta.env;

function SignIn() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onTouched'
  });

  const signIn = async(data) => {
    try {
      const res = await axios.post(`${VITE_APP_HOST}/users/sign_in`, data);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.cookie = `todo=${res.data.token}; expires=${tomorrow.toUTCString()}`;
      Swal.fire({
        title: '登入成功',
        icon: 'success',
        showConfirmButton: false,
        timer: 500
      }).then(() => {navigate('/todo')});
    } catch (err) {
      Swal.fire({
        title: '登入失敗',
        text: err.response.data.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      });
    }
  }

  return (
  <>
    <div id="loginPage" className="bg-yellow">
        <div className="conatiner loginPage vhContainer ">
            <div className="side">
                <a href="#"><img className="logoImg" src="https://raw.githubusercontent.com/jesswu1551/react_todo/main/src/assets/logo.png" alt="logoImg" /></a>
                <img className="d-m-n" src="https://raw.githubusercontent.com/jesswu1551/react_todo/main/src/assets/todo.png" alt="workImg" />
            </div>
            <div>
                <form className="formControls" onSubmit={handleSubmit(signIn)}>
                    <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>

                    <label className="formControls_label" htmlFor="email">Email</label>
                    <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email"
                           {...register('email', {required: {value: true, message: '信箱必填'}, pattern: {value: /^\S+@\S+$/i, message: '信箱格式錯誤'}})} />
                    <span>{errors.email && errors.email.message}</span>

                    <label className="formControls_label" htmlFor="password">密碼</label>
                    <input className="formControls_input" type="password" name="password" id="password" placeholder="請輸入密碼"
                           {...register('password', {required: {value: true, message: '密碼必填'}, minLength: {value: 6, message: '密碼不可低於 6 個字元'}})} />
                    <span>{errors.password && errors.password.message}</span>

                    <input className="formControls_btnSubmit" type="submit" value="登入" />
                    <NavLink to="/signUp" className="formControls_btnLink"><p>註冊帳號</p></NavLink>
                </form>
            </div>
        </div>
    </div>
  </>
  )
}

export default SignIn
