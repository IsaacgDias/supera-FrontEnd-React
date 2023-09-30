import "./card.css"

// Interface CardProps que descreve as propriedades esperadas para este componente  
interface CardProps {
  dataTransferencia: Date;
  valor: number;
  tipo: string;
  nomeOperadorTransacao: string;
}

// Declara o componenete Card que recebe as proriedades do CardProps
export function Card(props: CardProps) {
  //Passa as propriedades como parâmetros
  const { dataTransferencia, valor, tipo, nomeOperadorTransacao } = props; // desestruturação

  return (
    //Redenriza uma tabela com os dados
    <tr>
      <td>{dataTransferencia.toLocaleString()}</td>
      <td>{valor.toFixed(2)}</td>
      <td>{tipo}</td>
      <td>{nomeOperadorTransacao}</td>
    </tr>
  );
}

