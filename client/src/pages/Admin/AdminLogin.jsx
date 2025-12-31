import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const AdminLogin = () => {
  const { adminLogin } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border p-6 w-80">
        <h2 className="text-xl mb-4">Admin Login</h2>

        <input
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => adminLogin(email, password)}
          className="bg-primary text-white w-full py-2"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
