/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from '@/components/Home';
import useIsAuthed from '@/hooks/useIsAuthed';
// import Header from '@/components/Header';
// import Login from '@/components/Login';
// import FutureverseProviders from '@/providers/FvProvider';
// import MintAccessories from '@/components/MintAccessories';
// import MyCollection from '@/components/MyCollection';
// import Mint from '@/components/Mint';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { useEffect } from 'react';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route
            path="/mint"
            element={
              <ProtectedRoute>
                <Mint />
              </ProtectedRoute>
            }
          /> */}
        {/* <Route
            path="/accessories"
            element={
              <ProtectedRoute>
                <MintAccessories />
              </ProtectedRoute>
            }
          /> */}
        {/* <Route
            path="/my-collection"
            element={
              <ProtectedRoute>
                <MyCollection />
              </ProtectedRoute>
            }
          /> */}
      </Route>
    </Routes>
  );
}

export default App;

function Layout() {
  return (
    <div className=" bg-slate-900">
      <div className="p-4 pt-24">
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useIsAuthed();

  useEffect(() => {
    if (!isAuthed) {
      toast.warning('You are not logged in or your wallet is not connected', {
        id: 'login',
      });
    }
  }, [isAuthed]);

  if (!isAuthed) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
