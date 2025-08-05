import { useState, useContext, useEffect } from "react";

// Se estiver usando AuthContext do App.jsx
import { AuthContext } from "../App";

// Dados mockados - em produção viriam de uma API
const initialBooks = [
  {
    id: 1,
    title: "Dom Casmurro",
    author: "Machado de Assis",
    genre: "Romance",
    year: 1899,
    isbn: "978-85-359-0277-5",
    available: true,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    description: "Uma das obras mais conhecidas da literatura brasileira.",
    totalCopies: 3,
    availableCopies: 2,
    addedDate: "2024-01-15",
    lastUpdated: "2024-11-20"
  },
  {
    id: 2,
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    genre: "Naturalismo",
    year: 1890,
    isbn: "978-85-359-0278-2",
    available: true,
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    description: "Romance naturalista que retrata a vida em um cortiço carioca.",
    totalCopies: 2,
    availableCopies: 1,
    addedDate: "2024-02-10",
    lastUpdated: "2024-11-18"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Ficção Científica",
    year: 1949,
    isbn: "978-85-359-0279-9",
    available: false,
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
    description: "Distopia sobre um futuro totalitário.",
    totalCopies: 2,
    availableCopies: 0,
    addedDate: "2024-03-05",
    lastUpdated: "2024-11-22"
  }
];

const initialLoans = [
  {
    id: 1,
    bookId: 3,
    bookTitle: "1984",
    userName: "João Silva",
    userEmail: "joao@email.com",
    loanDate: "2024-11-08",
    dueDate: "2024-12-08",
    returnDate: null,
    status: "active",
    renewals: 0,
    maxRenewals: 2
  },
  {
    id: 2,
    bookId: 1,
    bookTitle: "Dom Casmurro",
    userName: "Maria Santos",
    userEmail: "maria@email.com",
    loanDate: "2024-10-20",
    dueDate: "2024-11-20",
    returnDate: "2024-11-18",
    status: "returned",
    renewals: 1,
    maxRenewals: 2
  }
];

const genres = ["Romance", "Naturalismo", "Realismo", "Ficção Científica", "Realismo Mágico", "Fantasia", "Terror", "Biografia"];

export default function Curador() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [books, setBooks] = useState(initialBooks);
  const [loans, setLoans] = useState(initialLoans);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Se estiver usando AuthContext
  const { user } = useContext(AuthContext);

  // Formulário para adicionar/editar livros
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    isbn: "",
    description: "",
    cover: "",
    totalCopies: 1,
    availableCopies: 1
  });

  // Resetar formulário
  const resetForm = () => {
    setBookForm({
      title: "",
      author: "",
      genre: "",
      year: "",
      isbn: "",
      description: "",
      cover: "",
      totalCopies: 1,
      availableCopies: 1
    });
    setEditingBook(null);
  };

  // Abrir modal para adicionar livro
  const handleAddBook = () => {
    resetForm();
    setShowBookModal(true);
  };

  // Abrir modal para editar livro
  const handleEditBook = (book) => {
    setBookForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      year: book.year,
      isbn: book.isbn,
      description: book.description,
      cover: book.cover,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies
    });
    setEditingBook(book);
    setShowBookModal(true);
  };

  // Salvar livro (adicionar ou editar)
  const handleSaveBook = (e) => {
    e.preventDefault();
    
    if (editingBook) {
      // Editar livro existente
      setBooks(books.map(book => 
        book.id === editingBook.id 
          ? { ...book, ...bookForm, lastUpdated: new Date().toISOString().split('T')[0] }
          : book
      ));
    } else {
      // Adicionar novo livro
      const newBook = {
        ...bookForm,
        id: Math.max(...books.map(b => b.id)) + 1,
        available: bookForm.availableCopies > 0,
        addedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setBooks([...books, newBook]);
    }
    
    setShowBookModal(false);
    resetForm();
  };

  // Remover livro
  const handleDeleteBook = (bookId) => {
    if (window.confirm("Tem certeza que deseja remover este livro?")) {
      setBooks(books.filter(book => book.id !== bookId));
    }
  };

  // Calcular estatísticas
  const stats = {
    totalBooks: books.length,
    totalCopies: books.reduce((sum, book) => sum + book.totalCopies, 0),
    availableBooks: books.filter(book => book.available).length,
    activeLoans: loans.filter(loan => loan.status === "active").length,
    overdueLoans: loans.filter(loan => 
      loan.status === "active" && new Date(loan.dueDate) < new Date()
    ).length
  };

  // Filtrar livros
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  // Estilos
  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "20px"
  };

  const headerStyle = {
    marginBottom: "30px",
    textAlign: "center"
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "8px"
  };

  const tabsStyle = {
    display: "flex",
    borderBottom: "2px solid #e5e7eb",
    marginBottom: "30px",
    gap: "0"
  };

  const tabStyle = {
    padding: "12px 24px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    color: "#6b7280",
    transition: "all 0.2s"
  };

  const activeTabStyle = {
    ...tabStyle,
    color: "#2563eb",
    borderBottomColor: "#2563eb"
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginBottom: "20px"
  };

  const buttonStyle = {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s"
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2563eb",
    color: "white"
  };

  const successButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#059669",
    color: "white"
  };

  const warningButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#d97706",
    color: "white"
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#dc2626",
    color: "white"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "2px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "14px"
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "white"
  };

  // Modal de adicionar/editar livro
  const BookModal = () => {
    if (!showBookModal) return null;

    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto"
        }}>
          <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>
            {editingBook ? "Editar Livro" : "Adicionar Novo Livro"}
          </h2>
          
          <form onSubmit={handleSaveBook}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Título *</label>
                <input
                  type="text"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Autor *</label>
                <input
                  type="text"
                  value={bookForm.author}
                  onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Gênero *</label>
                <select
                  value={bookForm.genre}
                  onChange={(e) => setBookForm({...bookForm, genre: e.target.value})}
                  style={selectStyle}
                  required
                >
                  <option value="">Selecione...</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Ano *</label>
                <input
                  type="number"
                  value={bookForm.year}
                  onChange={(e) => setBookForm({...bookForm, year: parseInt(e.target.value)})}
                  style={inputStyle}
                  min="1000"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>ISBN</label>
                <input
                  type="text"
                  value={bookForm.isbn}
                  onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
                  style={inputStyle}
                  placeholder="978-85-359-0277-5"
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>URL da Capa</label>
              <input
                type="url"
                value={bookForm.cover}
                onChange={(e) => setBookForm({...bookForm, cover: e.target.value})}
                style={inputStyle}
                placeholder="https://exemplo.com/capa.jpg"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Descrição</label>
              <textarea
                value={bookForm.description}
                onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                style={{...inputStyle, height: "80px", resize: "vertical"}}
                placeholder="Descrição do livro..."
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Total de Exemplares *</label>
                <input
                  type="number"
                  value={bookForm.totalCopies}
                  onChange={(e) => setBookForm({...bookForm, totalCopies: parseInt(e.target.value)})}
                  style={inputStyle}
                  min="1"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Exemplares Disponíveis *</label>
                <input
                  type="number"
                  value={bookForm.availableCopies}
                  onChange={(e) => setBookForm({...bookForm, availableCopies: parseInt(e.target.value)})}
                  style={inputStyle}
                  min="0"
                  max={bookForm.totalCopies}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                style={{...buttonStyle, backgroundColor: "#6b7280", color: "white"}}
              >
                Cancelar
              </button>
              <button type="submit" style={successButtonStyle}>
                {editingBook ? "Salvar Alterações" : "Adicionar Livro"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Dashboard
  const Dashboard = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div style={{...cardStyle, textAlign: "center", backgroundColor: "#eff6ff"}}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#2563eb" }}>{stats.totalBooks}</div>
          <div style={{ color: "#6b7280" }}>Total de Títulos</div>
        </div>
        <div style={{...cardStyle, textAlign: "center", backgroundColor: "#f0fdf4"}}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#059669" }}>{stats.totalCopies}</div>
          <div style={{ color: "#6b7280" }}>Total de Exemplares</div>
        </div>
        <div style={{...cardStyle, textAlign: "center", backgroundColor: "#fefce8"}}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#d97706" }}>{stats.activeLoans}</div>
          <div style={{ color: "#6b7280" }}>Empréstimos Ativos</div>
        </div>
        <div style={{...cardStyle, textAlign: "center", backgroundColor: "#fef2f2"}}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#dc2626" }}>{stats.overdueLoans}</div>
          <div style={{ color: "#6b7280" }}>Empréstimos Atrasados</div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "bold" }}>Atividade Recente</h3>
        <div style={{ space: "12px" }}>
          {loans.slice(0, 5).map(loan => (
            <div key={loan.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              backgroundColor: "#f9fafb",
              borderRadius: "6px",
              marginBottom: "8px"
            }}>
              <div>
                <strong>{loan.bookTitle}</strong> - {loan.userName}
              </div>
              <div style={{
                fontSize: "12px",
                padding: "4px 8px",
                borderRadius: "12px",
                backgroundColor: loan.status === "active" ? "#fef3c7" : "#d1fae5",
                color: loan.status === "active" ? "#92400e" : "#065f46"
              }}>
                {loan.status === "active" ? "Emprestado" : "Devolvido"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Gerenciar Livros
  const BooksManagement = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Buscar livros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{...inputStyle, width: "300px"}}
        />
        <button onClick={handleAddBook} style={primaryButtonStyle}>
          ➕ Adicionar Livro
        </button>
      </div>

      <div style={cardStyle}>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Livro</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Autor</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Gênero</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Exemplares</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={book.cover}
                        alt={book.title}
                        style={{ width: "40px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                      />
                      <div>
                        <div style={{ fontWeight: "bold" }}>{book.title}</div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>ISBN: {book.isbn}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>{book.author}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      backgroundColor: "#e5e7eb",
                      borderRadius: "12px"
                    }}>
                      {book.genre}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {book.availableCopies}/{book.totalCopies}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <span style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      backgroundColor: book.available ? "#d1fae5" : "#fee2e2",
                      color: book.available ? "#065f46" : "#991b1b"
                    }}>
                      {book.available ? "Disponível" : "Indisponível"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button
                        onClick={() => handleEditBook(book)}
                        style={{...buttonStyle, backgroundColor: "#f59e0b", color: "white"}}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        style={dangerButtonStyle}
                        title="Remover"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Gerenciar Empréstimos
  const LoansManagement = () => (
    <div style={cardStyle}>
      <h3 style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>Empréstimos</h3>
      <div style={{ overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Usuário</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Livro</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Data Empréstimo</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Data Prevista</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => {
              const isOverdue = loan.status === "active" && new Date(loan.dueDate) < new Date();
              return (
                <tr key={loan.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "12px" }}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{loan.userName}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>{loan.userEmail}</div>
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>{loan.bookTitle}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>{loan.loanDate}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <span style={{ color: isOverdue ? "#dc2626" : "inherit" }}>
                      {loan.dueDate}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <span style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      backgroundColor: loan.status === "active" 
                        ? (isOverdue ? "#fee2e2" : "#fef3c7")
                        : "#d1fae5",
                      color: loan.status === "active"
                        ? (isOverdue ? "#991b1b" : "#92400e")
                        : "#065f46"
                    }}>
                      {loan.status === "active" 
                        ? (isOverdue ? "Atrasado" : "Ativo")
                        : "Devolvido"
                      }
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {loan.status === "active" && (
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <button style={successButtonStyle}>
                          ✅ Devolver
                        </button>
                        {loan.renewals < loan.maxRenewals && (
                          <button style={warningButtonStyle}>
                            🔄 Renovar
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>🔧 Painel do Curador</h1>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          Gerencie livros, empréstimos e monitore a biblioteca
        </p>
      </header>

      {/* Navegação por Abas */}
      <div style={tabsStyle}>
        <button
          onClick={() => setActiveTab("dashboard")}
          style={activeTab === "dashboard" ? activeTabStyle : tabStyle}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab("books")}
          style={activeTab === "books" ? activeTabStyle : tabStyle}
        >
          📚 Gerenciar Livros
        </button>
        <button
          onClick={() => setActiveTab("loans")}
          style={activeTab === "loans" ? activeTabStyle : tabStyle}
        >
          📋 Empréstimos
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "books" && <BooksManagement />}
      {activeTab === "loans" && <LoansManagement />}

      {/* Modal de Livro */}
      <BookModal />
    </div>
  );
}