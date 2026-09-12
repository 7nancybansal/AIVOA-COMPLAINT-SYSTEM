import { LayoutDashboard, FileText, ClipboardList, Settings } from "lucide-react";

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="logo">
                <span className="logo-mark">A</span>
                <span>AIVOA</span>
            </div>
    

        <nav className="sidebar-nav">
        <a href="#">
            <LayoutDashboard size={18} />
            Dashboard
        </a>

        <a href="#" className="active">
            <FileText size={18} />
            Complaints
        </a>

        <a href="#">
            <ClipboardList size={18} />
            QMS Records
        </a>

        <a href="#">
            <Settings size={18} />
            Settings
        </a>
        </nav>
    </aside>
    );
}

export default Sidebar;