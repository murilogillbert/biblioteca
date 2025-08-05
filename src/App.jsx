import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";

import Home from "./pages/Home";
import Book from "./pages/book";
import Curador from "./pages/curador";
import LoginRegister from "./pages/loginRegister";

// Contexto de autenticação
export const AuthContext = createContext();

// Hook de autenticação melhorado
function useAuth() {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há dados do usuário no localStorage na inicialização
    try {
      const storedUser = localStorage.getItem("user");
      const storedIsLogged = localStorage.getItem("isLogged");
      
      if (storedUser && storedIsLogged === "true") {
        setUser(JSON.parse(storedUser));
        setIsLogged(true);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error);
      // Limpar dados corrompidos
      localStorage.removeItem("user");
      localStorage.removeItem("isLogged");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    try {
      setUser(userData);
      setIsLogged(true);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLogged", "true");
    } catch (error) {
      console.error("Erro ao salvar dados de login:", error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setIsLogged(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isLogged");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return { user, isLogged, loading, login, logout };
}

// Componente de rota protegida melhorado
function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isLogged, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "200px" 
      }}>
        Carregando...
      </div>
    );
  }

  if (!isLogged) {
    // Redirecionar para login preservando a rota desejada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div style={{ 
        padding: "20px", 
        textAlign: "center", 
        color: "red" 
      }}>
        <h2>Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta área.</p>
        <Link to="/">Voltar ao início</Link>
      </div>
    );
  }

  return children;
}

// Componente de navegação melhorado
function Navbar() {
  const { user, isLogged, logout } = useContext(AuthContext);

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    transition: "background-color 0.2s"
  };

  const buttonStyle = {
    ...linkStyle,
    backgroundColor: "transparent",
    border: "1px solid white",
    cursor: "pointer"
  };

  const leftLinksStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center"
  };

  const rightLinksStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center"
  };

  return (
    <nav style={navStyle}>
      <div style={leftLinksStyle}>
        <Link to="/" style={linkStyle}>
          📚 Biblioteca Digital
        </Link>
        <Link to="/" style={linkStyle}>
          Catálogo
        </Link>
      </div>
      
      <div style={rightLinksStyle}>
        {isLogged ? (
          <>
            <span style={{ marginRight: "10px" }}>
              Olá, {user?.name || 'Usuário'}!
            </span>
            {user?.role === 'admin' && (
              <Link to="/curador" style={linkStyle}>
                🔧 Admin
              </Link>
            )}
            <button 
              onClick={logout} 
              style={buttonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.1)"}
              onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
            >
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" style={linkStyle}>
            🔐 Login / Cadastro
          </Link>
        )}
      </div>
    </nav>
  );
}

// Componente principal da aplicação
export default function App() {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px"
      }}>
        Carregando aplicação...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <Router>
        <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
          <Navbar />
          <main style={{ padding: "20px" }}>
            <Routes>
              {/* Rota pública - Home */}
              <Route path="/" element={<Home />} />
              
              {/* Rota protegida - Detalhes do livro */}
              <Route 
                path="/book/:id" 
                element={
                  <ProtectedRoute>
                    <Book />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rota protegida - Admin apenas */}
              <Route 
                path="/curador" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Curador />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rota de login - redireciona se já logado */}
              <Route 
                path="/login" 
                element={
                  auth.isLogged ? 
                    <Navigate to="/" replace /> : 
                    <LoginRegister />
                } 
              />
              
              {/* Rota 404 - Página não encontrada */}
              <Route 
                path="*" 
                element={
                  <div style={{ 
                    textAlign: "center", 
                    padding: "50px",
                    color: "#666"
                  }}>
                    <h2>Página não encontrada</h2>
                    <p>A página que você está procurando não existe.</p>
                    <Link 
                      to="/" 
                      style={{ 
                        color: "#2563eb", 
                        textDecoration: "none",
                        fontWeight: "bold"
                      }}
                    >
                      Voltar ao início
                    </Link>
                  </div>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}