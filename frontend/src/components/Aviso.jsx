/** Mensagem de estado (erro, sucesso ou informacao) exibida acima do conteudo. */
export default function Aviso({ tipo = 'info', children }) {
  if (!children) return null;
  return (
    <p className={`aviso aviso--${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}
