import { Link } from "react-router-dom";

export const NavBar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm px-2 sm:px-4">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link to="/vehiculos">Vehiculo</Link></li>
                        <li><Link to="/registro">Registro</Link></li>
                    </ul>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold ml-2">Control de flota</h1>
            </div>

            <div className="navbar-end hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li className='flex justify-center mt-2 lg:mt-0'>
                        <Link to="/vehiculos">
                            <button className="btn btn-accent">Vehiculo</button>
                        </Link>
                    </li>
                    <li className='flex justify-center mt-2 lg:mt-0'>
                        <Link to="/registro">
                            <button className="btn btn-secondary lg:ml-4">Registro</button>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>

    )
}
