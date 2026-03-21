import '@/app/globals.css';
import { Toaster } from 'react-hot-toast';
import NavbarAdmin from '@/components/admin/NavbarAdmin';
import SidebarAdmin from '@/components/admin/SidebarAdmin';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Toaster position="top-right" />
      <SidebarAdmin />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <NavbarAdmin className="w-full shrink-0" />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
