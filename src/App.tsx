import './App.css';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from '@/components/Home';
import useIsAuthed from '@/hooks/useIsAuthed';
import Header from '@/components/Header';
import FutureverseProviders from '@/components/providers/FvProvider';
import Login from '@/components/Login';
import MintAccessories from '@/components/MintAccessories';
import MyCollection from '@/components/MyCollection';
import Mint from '@/components/Mint';

function App() {
  return (
    <FutureverseProviders>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/mint"
            element={
              <ProtectedRoute>
                <Mint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accessories"
            element={
              <ProtectedRoute>
                <MintAccessories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-collection"
            element={
              <ProtectedRoute>
                <MyCollection />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </FutureverseProviders>
  );
}

export default App;

function Layout() {
  return (
    <div className=" bg-slate-900">
      <Header />
      <div className="p-4 pt-24">
        <Outlet />
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthed = useIsAuthed();

  if (!isAuthed) {
    return <Navigate to="/" replace />;
  }

  return children;
}
