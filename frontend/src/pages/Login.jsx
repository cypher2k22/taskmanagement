import "../index.css";

function Login() {
  return (
    <div className="app">
      <h1 className="title">Login Page</h1>

      <div className="form">
        <input className="input" placeholder="Username" />
        <input className="input" type="password" placeholder="Password" />

        <button className="btn btn-outline btn-warning">Login</button>
        <a className="signup" >Dont have an account click here for signup</a>
      </div>
      
    </div>
  );
}

export default Login;