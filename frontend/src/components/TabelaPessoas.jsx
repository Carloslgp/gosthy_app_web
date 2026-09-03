/** Tabela de pessoas com os estados de carregando e vazio. */
export default function TabelaPessoas({ pessoas, carregando, mensagemVazio = 'Nenhuma pessoa encontrada.' }) {
  if (carregando) return <p className="estado">Carregando…</p>;
  if (!pessoas?.length) return <p className="estado">{mensagemVazio}</p>;

  return (
    <div className="tabela-wrapper">
      <table className="tabela">
        <thead>
          <tr>
            <th scope="col" className="tabela__id">
              ID
            </th>
            <th scope="col">Nome</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((pessoa) => (
            <tr key={pessoa.id}>
              <td className="tabela__id">{pessoa.id}</td>
              <td>{pessoa.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
