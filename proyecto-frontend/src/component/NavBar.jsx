import { Link } from "react-router-dom";

export const NavBar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
                        </svg>
                    </div>

                    {/* Mobile Menu */}
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">

                        <li><Link to="/vehiculos">Vehiculo</Link></li>
                        <li><Link to="/registro">Registro</Link></li>
                    </ul>
                </div>

                    <h1 className="text-3xl font-bold">Control de flota</h1>
            </div>

            {/* Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link to="/vehiculos">
                            <button className="btn btn-accent">Vehiculo</button>
                        </Link>
                    </li>

                    <li>
                        <Link to="/registro">
                            <button className="btn btn-secondary ml-4">Registro</button>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Search and Add */}
            <div className="navbar-end flex gap-2">

                <input
                    type="text"
                    placeholder="Buscar..."
                    className="input input-bordered input-sm w-full max-w-xs"
                />

                <a className="btn btn-primary">Add Client</a>
            </div>
        </div>
    )
}
