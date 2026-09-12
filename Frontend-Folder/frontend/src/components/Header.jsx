import { Bell, UserCircle } from "lucide-react";

function Header() {
    return (
    <header className="header">
        <div>
        <h1>Customer Complaints</h1>
        <p>Review, assess and log customer complaints</p>
        </div>

        <div className="header-actions">
        <button className="icon-button">
            <Bell size={19} />
        </button>

        <div className="user">
            <UserCircle size={30} />
            <div>
            <strong>QA User</strong>
            <span>Quality Assurance</span>
            </div>
        </div>
        </div>
    </header>
    );
}

export default Header;