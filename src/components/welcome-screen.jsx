import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

function WelcomeScreen() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <div className="relative h-full w-full bg-white">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-2">
          <img
            src={logo}
            alt="Moneta Logo"
            className="mb-4 h-72 w-72 rounded-full"
          />
          <p className="text-md text-gray-500">
            Tu aplicación de gestión financiera personal
          </p>
          <button onClick={handleLogin} className='mt-4 text-md rounded-lg bg-[#18181b] px-4 py-2 text-white hover:bg-[#27272a] transition-colors'>
           Iniciar Sesión
          </button>
        </div>
      </div>
    </>
  )
}

export default WelcomeScreen