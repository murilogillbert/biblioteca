import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Se estiver usando AuthContext do App.jsx
import { AuthContext } from "../App";

// Usuários mockados - em produção viriam de uma API/banco de dados
const mockUsers = [
  {
    id: 1,
    name: "Administrador",
    email: "admin@biblioteca.com",
    password: "admin123",
    role: "admin",
    createdAt: "2024-01-01",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao@email.com",
    password: "123456",
    role: "user",
    createdAt: "2024-02-15",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Maria Santos",
    email: "maria@email.com",
    password: "maria123",
    role: "user",
    createdAt: "2024-03-10",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c123?w=150&h=150&fit=crop&crop=face"
  }
];

export default function LoginRegister() {
  const [mode, setMode] = useState("login"); // "login" ou "register"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState(mockUsers);

  const navigate = useNavigate();
  const location = useLocation();
  
  // Se estiver usando AuthContext
  const { login } = useContext(AuthContext);
  

  // Pegar a rota de origem para redirecionamento
  const from = location.state?.from?.pathname || "/";

  // Validações
  const validateForm = () => {
    const newErrors = {};

    if (mode === "register") {
      if (!formData.name.trim()) {
        newErrors.name = "Nome é obrigatório";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Nome deve ter pelo menos 2 caracteres";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (mode === "register") {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirmação de senha é obrigatória";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Senhas não coincidem";
      }

      // Verificar se email já existe
      if (users.find(user => user.email === formData.email)) {
        newErrors.email = "Email já cadastrado";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = users.find(
        u => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Chamar função de login do contexto
        login({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        });
        
        // Redirecionar para a página original ou home
        navigate(from, { replace: true });
      } else {
        setErrors({ general: "Email ou senha incorretos" });
      }
    } catch (error) {
      setErrors({ general: "Erro ao fazer login. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: "user",
        createdAt: new Date().toISOString().split('T')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=2563eb&color=fff`
      };

      setUsers([...users, newUser]);

      // Fazer login automático após registro
      login({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      });

      navigate(from, { replace: true });
    } catch (error) {
      setErrors({ general: "Erro ao criar conta. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  // Alternar entre campos
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Estilos
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px"
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "40px",
    width: "100%",
    maxWidth: "440px"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "32px"
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "8px"
  };

  const subtitleStyle = {
    color: "#6b7280",
    fontSize: "16px"
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column"
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px"
  };

  const inputStyle = {
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "all 0.2s",
    outline: "none"
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: "#2563eb",
    boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)"
  };

  const inputErrorStyle = {
    ...inputStyle,
    borderColor: "#dc2626"
  };

  const errorStyle = {
    color: "#dc2626",
    fontSize: "14px",
    marginTop: "4px"
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  };

  const buttonHoverStyle = {
    backgroundColor: "#1d4ed8"
  };

  const buttonDisabledStyle = {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed"
  };

  const toggleStyle = {
    textAlign: "center",
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px"
  };

  const linkStyle = {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
    cursor: "pointer"
  };

  const passwordToggleStyle = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
    fontSize: "14px"
  };

  const demoCredentialsStyle = {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px"
  };

  const demoTitleStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: "8px"
  };

  const demoItemStyle = {
    fontSize: "13px",
    color: "#1e40af",
    marginBottom: "4px",
    fontFamily: "monospace"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            {mode === "login" ? "📚 Entrar na Biblioteca" : "📝 Criar Conta"}
          </h1>
          <p style={subtitleStyle}>
            {mode === "login" 
              ? "Acesse sua conta para emprestar livros" 
              : "Crie sua conta e comece a explorar"
            }
          </p>
        </div>

        {/* Credenciais de Demonstração */}
        {mode === "login" && (
          <div style={demoCredentialsStyle}>
            <div style={demoTitleStyle}>🧪 Contas de Demonstração:</div>
            <div style={demoItemStyle}>👨‍💼 Admin: admin@biblioteca.com / admin123</div>
            <div style={demoItemStyle}>👤 Usuário: joao@email.com / 123456</div>
            <div style={demoItemStyle}>👤 Usuário: maria@email.com / maria123</div>
          </div>
        )}

        <form style={formStyle} onSubmit={mode === "login" ? handleLogin : handleRegister}>
          {/* Campo Nome (apenas no registro) */}
          {mode === "register" && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nome Completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                style={errors.name ? inputErrorStyle : inputStyle}
                placeholder="Digite seu nome completo"
                disabled={loading}
              />
              {errors.name && <div style={errorStyle}>{errors.name}</div>}
            </div>
          )}

          {/* Campo Email */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value.toLowerCase())}
              style={errors.email ? inputErrorStyle : inputStyle}
              placeholder="seu@email.com"
              disabled={loading}
            />
            {errors.email && <div style={errorStyle}>{errors.email}</div>}
          </div>

          {/* Campo Senha */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Senha</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                style={errors.password ? inputErrorStyle : inputStyle}
                placeholder="Digite sua senha"
                disabled={loading}
              />
              <button
                type="button"
                style={passwordToggleStyle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <div style={errorStyle}>{errors.password}</div>}
          </div>

          {/* Campo Confirmar Senha (apenas no registro) */}
          {mode === "register" && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Confirmar Senha</label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                style={errors.confirmPassword ? inputErrorStyle : inputStyle}
                placeholder="Confirme sua senha"
                disabled={loading}
              />
              {errors.confirmPassword && <div style={errorStyle}>{errors.confirmPassword}</div>}
            </div>
          )}

          {/* Erro Geral */}
          {errors.general && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px",
              textAlign: "center"
            }}>
              {errors.general}
            </div>
          )}

          {/* Botão de Submit */}
          <button
            type="submit"
            style={{
              ...buttonStyle,
              ...(loading ? buttonDisabledStyle : {})
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #ffffff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
                {mode === "login" ? "Entrando..." : "Criando conta..."}
              </>
            ) : (
              <>
                {mode === "login" ? "🔑 Entrar" : "🚀 Criar Conta"}
              </>
            )}
          </button>
        </form>

        {/* Toggle entre Login e Registro */}
        <div style={toggleStyle}>
          {mode === "login" ? (
            <p>
              Não tem uma conta?{" "}
              <a
                onClick={() => {
                  setMode("register");
                  setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                  setErrors({});
                }}
                style={linkStyle}
              >
                Criar conta
              </a>
            </p>
          ) : (
            <p>
              Já tem uma conta?{" "}
              <a
                onClick={() => {
                  setMode("login");
                  setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                  setErrors({});
                }}
                style={linkStyle}
              >
                Fazer login
              </a>
            </p>
          )}
        </div>

        {/* Informações adicionais */}
        <div style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "12px",
          color: "#6b7280"
        }}>
          {mode === "register" ? (
            <p>Ao criar uma conta, você concorda com nossos termos de uso</p>
          ) : (
            <p>Acesso seguro e protegido à sua biblioteca digital</p>
          )}
        </div>
      </div>

      {/* CSS para animação de loading */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}