import { useParams } from "react-router-dom";

const mockBooks = [
  { id: 1, title: "Dom Casmurro", description: "Um clássico brasileiro." },
  { id: 2, title: "O Cortiço", description: "Romance naturalista." },
  { id: 3, title: "Memórias Póstumas", description: "Narrado por um defunto-autor." }
];

export default function Book() {
  const { id } = useParams();
  const book = mockBooks.find(b => b.id === parseInt(id));

  if (!book) {
    return <h2>Livro não encontrado</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{book.title}</h1>
      <p>{book.description}</p>
      <button>Emprestar</button>
    </div>
  );
}
