import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App.jsx";

// Dados mockados mais completos
const mockBooks = [
  {
    id: 1,
    title: "Dom Casmurro",
    author: "Machado de Assis",
    genre: "Romance",
    year: 1899,
    isbn: "978-85-359-0277-5",
    available: true,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    description: "Uma das obras mais conhecidas da literatura brasileira, narrando a história de Bentinho e sua obsessão por Capitu.",
    rating: 4.5,
    totalCopies: 3,
    availableCopies: 2
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
    description: "Romance naturalista que retrata a vida em um cortiço carioca do século XIX.",
    rating: 4.2,
    totalCopies: 2,
    availableCopies: 1
  },
  {
    id: 3,
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    genre: "Romance",
    year: 1881,
    isbn: "978-85-359-0279-9",
    available: false,
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
    description: "Narrado por um defunto autor, este romance revolucionou a literatura brasileira.",
    rating: 4.7,
    totalCopies: 2,
    availableCopies: 0,
    nextReturn: "2024-12-20"
  },
  {
    id: 4,
    title: "O Primo Basílio",
    author: "Eça de Queirós",
    genre: "Realismo",
    year: 1878,
    isbn: "978-85-359-0280-5",
    available: true,
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    description: "Romance que critica a burguesia lisboeta do século XIX.",
    rating: 4.1,
    totalCopies: 1,
    availableCopies: 1
  },
  {
    id: 5,
    title: "1984",
    author: "George Orwell",
    genre: "Ficção Científica",
    year: 1949,
    isbn: "978-85-359-0281-2",
    available: true,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    description: "Distopia sobre um futuro totalitário onde o governo controla todos os aspectos da vida.",
    rating: 4.8,
    totalCopies: 4,
    availableCopies: 3
  },
  {
    id: 6,
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    genre: "Realismo Mágico",
    year: 1967,
    isbn: "978-85-359-0282-9",
    available: true,
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    description: "A saga épica da família Buendía na fictícia cidade de Macondo.",
    rating: 4.6,
    totalCopies: 2,
    availableCopies: 2
  }
];

const genres = ["Todos", "Romance", "Naturalismo", "Realismo", "Ficção Científica", "Realismo Mágico"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setViewMode] = useState("grid"); // grid ou list
  
  // Se estiver usando AuthContext, descomente:
  const { user, isLogged } = useContext(AuthContext);
    

  // Filtros e ordenação
  const filteredAndSortedBooks = mockBooks
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                           book.author.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = selectedGenre === "Todos" || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "year":
          return b.year - a.year;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  // Componente de cartão do livro
  const BookCard = ({ book }) => {
    const cardStyle = {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      transition: "all 0.3s ease",
      cursor: "pointer",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    };

    const imageStyle = {
      width: "100%",
      height: "200px",
      objectFit: "cover"
    };

    const contentStyle = {
      padding: "16px",
      flex: 1,
      display: "flex",
      flexDirection: "column"
    };

    const titleStyle = {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "8px",
      lineHeight: "1.4"
    };

    const authorStyle = {
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "8px"
    };

    const genreStyle = {
      fontSize: "12px",
      backgroundColor: "#e5e7eb",
      color: "#374151",
      padding: "4px 8px",
      borderRadius: "16px",
      display: "inline-block",
      marginBottom: "8px"
    };

    const statusStyle = {
      fontSize: "12px",
      padding: "4px 8px",
      borderRadius: "16px",
      fontWeight: "bold",
      marginTop: "auto"
    };

    const availableStyle = {
      ...statusStyle,
      backgroundColor: "#d1fae5",
      color: "#065f46"
    };

    const unavailableStyle = {
      ...statusStyle,
      backgroundColor: "#fee2e2",
      color: "#991b1b"
    };

    const ratingStyle = {
      fontSize: "14px",
      color: "#f59e0b",
      marginBottom: "8px"
    };

    return (
      <div style={cardStyle}>
        <img src={book.cover} alt={book.title} style={imageStyle} />
        <div style={contentStyle}>
          <h3 style={titleStyle}>{book.title}</h3>
          <p style={authorStyle}>por {book.author}</p>
          <div style={ratingStyle}>
            {"★".repeat(Math.floor(book.rating))} {book.rating}/5
          </div>
          <span style={genreStyle}>{book.genre}</span>
          <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "12px", lineHeight: "1.4" }}>
            {book.description.substring(0, 100)}...
          </p>
          <div style={book.available ? availableStyle : unavailableStyle}>
            {book.available 
              ? `Disponível (${book.availableCopies}/${book.totalCopies})`
              : `Indisponível${book.nextReturn ? ` - Retorna ${book.nextReturn}` : ''}`
            }
          </div>
        </div>
      </div>
    );
  };

  // Componente de lista do livro
  const BookListItem = ({ book }) => {
    const listItemStyle = {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      padding: "16px",
      marginBottom: "12px",
      display: "flex",
      gap: "16px",
      alignItems: "center"
    };

    const imageStyle = {
      width: "80px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "6px"
    };

    const contentStyle = {
      flex: 1
    };

    const titleStyle = {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: "4px"
    };

    const metaStyle = {
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "8px"
    };

    return (
      <div style={listItemStyle}>
        <img src={book.cover} alt={book.title} style={imageStyle} />
        <div style={contentStyle}>
          <h3 style={titleStyle}>{book.title}</h3>
          <p style={metaStyle}>{book.author} • {book.genre} • {book.year}</p>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
            {book.description.substring(0, 150)}...
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#f59e0b" }}>
              {"★".repeat(Math.floor(book.rating))} {book.rating}
            </span>
            <span style={{
              fontSize: "12px",
              padding: "4px 8px",
              borderRadius: "12px",
              backgroundColor: book.available ? "#d1fae5" : "#fee2e2",
              color: book.available ? "#065f46" : "#991b1b"
            }}>
              {book.available ? "Disponível" : "Indisponível"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Estilos principais
  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "40px"
  };

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "12px"
  };

  const subtitleStyle = {
    fontSize: "18px",
    color: "#6b7280",
    marginBottom: "20px"
  };

  const statsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "30px"
  };

  const statItemStyle = {
    textAlign: "center"
  };

  const statNumberStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2563eb"
  };

  const statLabelStyle = {
    fontSize: "14px",
    color: "#6b7280"
  };

  const filtersStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px"
  };

  const filterRowStyle = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap"
  };

  const inputStyle = {
    flex: 1,
    minWidth: "250px",
    padding: "12px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px"
  };

  const selectStyle = {
    padding: "12px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "white"
  };

  const toggleButtonStyle = {
    padding: "8px 12px",
    border: "2px solid #2563eb",
    borderRadius: "6px",
    backgroundColor: "white",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "14px"
  };

  const activeToggleStyle = {
    ...toggleButtonStyle,
    backgroundColor: "#2563eb",
    color: "white"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px"
  };

  const resultCountStyle = {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: "20px",
    fontSize: "16px"
  };

  // Estatísticas
  const totalBooks = mockBooks.length;
  const availableBooks = mockBooks.filter(book => book.available).length;
  const totalCopies = mockBooks.reduce((sum, book) => sum + book.totalCopies, 0);

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <h1 style={titleStyle}>📚 Biblioteca Digital</h1>
        <p style={subtitleStyle}>
          Descubra, empreste e explore nossa coleção de livros
        </p>
        
        {/* Estatísticas */}
        <div style={statsStyle}>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{totalBooks}</div>
            <div style={statLabelStyle}>Títulos</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{availableBooks}</div>
            <div style={statLabelStyle}>Disponíveis</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{totalCopies}</div>
            <div style={statLabelStyle}>Exemplares</div>
          </div>
        </div>

        {!isLogged && (
          <div style={{
            backgroundColor: "#fef3c7",
            color: "#92400e",
            padding: "12px 20px",
            borderRadius: "8px",
            marginTop: "20px",
            display: "inline-block"
          }}>
            📌 Faça <Link to="/login" style={{ color: "#2563eb", fontWeight: "bold" }}>login</Link> para emprestar livros
          </div>
        )}
      </header>

      {/* Filtros e Busca */}
      <div style={filtersStyle}>
        <div style={filterRowStyle}>
          <input
            type="text"
            placeholder="🔍 Buscar por título ou autor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />
          
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={selectStyle}
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="title">Título A-Z</option>
            <option value="author">Autor A-Z</option>
            <option value="year">Mais Recentes</option>
            <option value="rating">Melhor Avaliados</option>
          </select>

          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => setViewMode("grid")}
              style={viewMode === "grid" ? activeToggleStyle : toggleButtonStyle}
            >
              ⊞ Grade
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={viewMode === "list" ? activeToggleStyle : toggleButtonStyle}
            >
              ☰ Lista
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div style={resultCountStyle}>
        {filteredAndSortedBooks.length} {filteredAndSortedBooks.length === 1 ? 'livro encontrado' : 'livros encontrados'}
      </div>

      {/* Lista de Livros */}
      {filteredAndSortedBooks.length > 0 ? (
        viewMode === "grid" ? (
          <div style={gridStyle}>
            {filteredAndSortedBooks.map(book => (
              <Link 
                key={book.id} 
                to={`/book/${book.id}`} 
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <BookCard book={book} />
              </Link>
            ))}
          </div>
        ) : (
          <div>
            {filteredAndSortedBooks.map(book => (
              <Link 
                key={book.id} 
                to={`/book/${book.id}`} 
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <BookListItem book={book} />
              </Link>
            ))}
          </div>
        )
      ) : (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#6b7280"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📖</div>
          <h3 style={{ marginBottom: "8px" }}>Nenhum livro encontrado</h3>
          <p>Tente ajustar os filtros ou termo de busca</p>
        </div>
      )}
    </div>
  );
}