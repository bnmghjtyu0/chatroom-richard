import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

function NavLink({ label, to, activeOnlyWhenExact }) {
    let match = useRouteMatch({
        path: to,
        exact: activeOnlyWhenExact
    });
    return (
        <Link to={to} className={match ? 'active' : ''}>
            {label}
        </Link>
    );
}

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <button className="sidebar-toggle">
                    <i className="gg-menu-left" />
                </button>
            </div>
            <div className="sidebar-center">
                <nav className="sidebar-list p-0">
                    <NavLink activeOnlyWhenExact={true} to="/" label="Home" />
                    <NavLink to="/chatroom" label="chatroom" />
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
