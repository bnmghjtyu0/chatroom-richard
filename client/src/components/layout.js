import React from 'react';
import Sidebar from '../container/sidebar';

const withLayout = WrappedComponent => props => (
    <div className="container-fluid wrapper">
        {/* <div className="d-sm-none">
            <button onclick="toggleChatPeople()" className="toggle-chat-people">
                人員
            </button>
        </div> */}
        <div className="row">
            <Sidebar />
            <div className="main">
                <WrappedComponent {...props} />
            </div>
        </div>
    </div>
);
export default withLayout;
