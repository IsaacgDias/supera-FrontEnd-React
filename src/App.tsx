import React, { useState, useEffect } from 'react';
import './App.css';
import './components/card/card.css';
import { Card } from './components/card/card';
import { useBancoData } from './hooks/useBancoData';
import { BancoData } from './interface/BancoData';

function App() {
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Para os campos de entrada
  const [dataInicialF, setDataInicial] = useState('');
  const [dataFinalF, setDataFinal] = useState('');
  const [nomeOperadorF, setNomeOperador] = useState('');

  // Armazena os saldos
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [saldoPeriodo, setSaldoPeriodo] = useState(0);

  // Usando o hook useBancoData para buscar dados da API
  const { data } = useBancoData();

  // Armazena dados filtrados
  const [filteredData, setFilteredData] = useState<BancoData[]>([]);
  const [filteredOperador, setFilteredOperador] = useState<BancoData[]>([]);
  const [filter, setFilter] = useState<BancoData[]>([]);

  useEffect(() => {
    // Faz uma chamada à API uma vez quando o componente é montado
    fetch(`http://localhost:8080/`)
      .then(response => response.json())
      .then((data: BancoData[]) => {
        if (data) {
          // Calcula o saldo total inicial
          const saldo = data.reduce((total, transacao) => {
            return transacao.tipo === 'DEBITO' ? total - transacao.valor : total + transacao.valor;
          }, 0);

          setSaldoTotal(saldo);

          const saldoPeriodoCalculado = data
            ? data.reduce((total, transacao) => {
              return transacao.tipo === 'DEBITO' ? total - transacao.valor : total + transacao.valor;
            }, 0)
            : 0;

          setSaldoPeriodo(saldoPeriodoCalculado);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // Função para lidar com o clique no botão "Pesquisar"
  const handlePesquisarClick = () => {
      
     
   
    

    const dataInicial = `${dataInicialF}T00:00:00`;
    const dataFinal = `${dataFinalF}T23:59:59`;

    // Faz uma chamada à API para filtrar por período
    fetch(`http://localhost:8080/por-periodo?dataInicial=${dataInicial}&dataFinal=${dataFinal}`)
      .then(response => response.json())
      .then((data: BancoData[]) => {
       

        
        setFilteredData(data);
        
        // Verifica se a variável data não é undefined

        if (data) {
          const saldoPeriodoCalculado = data.reduce((total, transacao) => {
            const dataTransacao = new Date(transacao.dataTransferencia);
            if (dataTransacao >= new Date(dataInicial) && dataTransacao <= new Date(dataFinal)) {
              return transacao.tipo === 'DEBITO' ? total - transacao.valor : total + transacao.valor;
            }
            return total;
          }, 0);

          setSaldoPeriodo(saldoPeriodoCalculado); // Define o saldo no período
        }
        // Após a pesquisa bem-sucedida, Limpa os campos
        setDataInicial('');
        setDataFinal('');
        setNomeOperador('');
      })
      .catch(error => {
        console.error(error);
      });


    // Faz uma chamada à API para filtrar por nome do operador
    fetch(`http://localhost:8080/operador?nomeOperadorTransacao=${nomeOperadorF}`)
      .then(response => response.json())
      .then((data: BancoData[]) => {
        setFilteredOperador(data); // Atualiza os dados filtrados pelo operador

        if (data) {

          const saldoPeriodoCalculado = data.reduce((total, transacao) => {
            return transacao.tipo === 'DEBITO' ? total - transacao.valor : total + transacao.valor;
          }, 0);

          setSaldoPeriodo(saldoPeriodoCalculado); // Define o saldo no período
        }
        setDataInicial('');
        setDataFinal('');
        setNomeOperador('');
      })
      .catch(error => {
        console.error(error);
      });

    // Faz uma chamada à API para filtrar por nome do operador e o período de tempo
    fetch(`http://localhost:8080/dados?dataInicial=${dataInicial}&dataFinal=${dataFinal}&nomeOperadorTransacao=${nomeOperadorF}`)
      .then(response => response.json())
      .then((data: BancoData[]) => {
        setFilter(data); // Atualiza os dados filtrados pelo operador e datas
        if (data) {
          const saldoPeriodoCalculado = data.reduce((total, transacao) => {
            const dataTransacao = new Date(transacao.dataTransferencia);
            if (dataTransacao >= new Date(dataInicial) && dataTransacao <= new Date(dataFinal)) {
              return transacao.tipo === 'DEBITO' ? total - transacao.valor : total + transacao.valor;
            }
            return total;
          }, 0);

          setSaldoPeriodo(saldoPeriodoCalculado); // Define o saldo no período
        }
        setDataInicial('');
        setDataFinal('');
        setNomeOperador('');
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Remove o filtro da data início e data fim
  const handleRemoverFiltro = () => {
    setFilteredData([]); // Limpa os dados das datas filtradas
    setFilteredOperador([]); // Limpa os dados filtrados pelo nome do operador
    setFilter([]); // Limpa os dados filtrados das data e pelo nome do operador

    const saldoPeriodoCalculado = data
      ? data.reduce((total, transacao) => {
        return transacao.tipo === 'DEBITO' ? total - transacao.valor : total + transacao.valor;
      }, 0)
      : 0

    setSaldoPeriodo(saldoPeriodoCalculado);
  }

  // Função para renderizar os dados na tabela
  const renderTableData = () => {
    const displayData = filteredOperador.length > 0 ? filteredOperador : (filteredData.length > 0 ? filteredData : (filter.length > 0 ? filter : (data || [])));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = displayData.slice(startIndex, endIndex);

    // Renderiza a interface do usuário
    return slicedData.map((bancoData, index) => (
      <Card
        key={index}
        dataTransferencia={bancoData.dataTransferencia}
        nomeOperadorTransacao={bancoData.nomeOperadorTransacao}
        valor={bancoData.valor}
        tipo={bancoData.tipo}
      />
    ));
  };

  // Cálculo do número total de páginas
  const totalPages = Math.ceil(
    (filteredOperador.length > 0
      ? filteredOperador
      : filteredData.length > 0
      ? filteredData
      : filter.length > 0
      ? filter
      : data || []
    ).length / itemsPerPage
  );

  return (
    <div className="container">
      <h1>Banco</h1>

      <span>Saldo Total: R$ {saldoTotal.toFixed(2)}</span>

      <span>Saldo no Período: R$ {saldoPeriodo.toFixed(2)}</span>

      <label htmlFor="data-inicial">Data Início: </label>
      <input
        type="date"
        id="data-inicial"
        value={dataInicialF}
        onChange={e => setDataInicial(e.target.value)}
      />
      <label htmlFor="data-final">Data Fim: </label>
      <input
        type="date"
        id="data-final"
        value={dataFinalF}
        onChange={e => setDataFinal(e.target.value)}
      />
      <label>Nome Operador</label>
      <input
        type="text"
        id="nome-operador"
        value={nomeOperadorF}
        onChange={e => setNomeOperador(e.target.value)}
      />

      <button onClick={handlePesquisarClick}>Pesquisar</button>
      <button onClick={handleRemoverFiltro}>Remover Filtro</button>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data de Transferência</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Nome do Operador</th>
          </tr>
        </thead>
        <tbody>
          {renderTableData()} {/* Renderiza os dados filtrados na tabela */}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

export default App;
