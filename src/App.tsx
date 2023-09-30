import { useState, useEffect, ChangeEvent } from 'react';
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
  const handlePesquisarClick = async () => {
    // O usuário não consegue pesquisar sem selecionar algum filtro
    if (!dataInicialF && !dataFinalF && !nomeOperadorF) {
      alert("Seleciona o campos de filtro antes de pesquisar.");

    }

    //Exibe a mensagem senão encontrar dados correspondentes
    function showNoResultsMessage() {
      alert("Nenhum resultado encontrado no filtro");
      return handleRemoverFiltro();
    }

    const dataInicial = `${dataInicialF}T00:00:00`;
    const dataFinal = `${dataFinalF}T23:59:59`;

    // Faz uma chamada à API para filtrar por nome do operador
    if (nomeOperadorF) {
      if (dataInicial == 'T00:00:00' && dataFinal == 'T23:59:59') {
        
        const endpoint = `http://localhost:8080/operador?nomeOperadorTransacao=${nomeOperadorF}`;

        fetch(endpoint)
          .then(response => response.json())
          .then((data: BancoData[]) => {
            if (Array.isArray(data) && data.length === 0) {
              showNoResultsMessage();
              return; 
            } else {
              setFilteredOperador(data); // Atualiza os dados filtrados por nome operador
            }


            if (data) {
              const saldoPeriodoCalculado = data.reduce((total, transacao) => {
                return transacao.tipo === 'DEBITO' ? total - transacao.valor : total + transacao.valor;
              }, 0);

              setSaldoPeriodo(saldoPeriodoCalculado); // Define o saldo para o operador
              
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    }

    // Faz uma chamada à API para filtrar por nome do operador e o período de tempo
    if (dataInicial && dataFinal && nomeOperadorF) {
      console.log("oieeeeeeee");
      console.log("dats" + dataInicial + dataFinal)
      const endpoint = `http://localhost:8080/dados?dataInicial=${dataInicial}&dataFinal=${dataFinal}&nomeOperadorTransacao=${nomeOperadorF}`;

      fetch(endpoint)
        .then(response => response.json())
        .then((data: BancoData[]) => {
          if (Array.isArray(data) && data.length === 0) {
            showNoResultsMessage();
            return; 
          } else {
            setFilter(data); // Atualiza os dados filtrados pelo período e operador
          }


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
        })
        .catch(error => {
          console.error(error);
        });
    }

    // Faz uma chamada à API para filtrar por período
    if (dataInicial && dataFinal && (nomeOperadorF == '')) {
      const endpoint = `http://localhost:8080/por-periodo?dataInicial=${dataInicial}&dataFinal=${dataFinal}`;

      fetch(endpoint)
        .then(response => response.json())
        .then((data: BancoData[]) => {
          if (Array.isArray(data) && data.length === 0) {
            showNoResultsMessage();
            return; 
          } else {
            setFilteredData(data); // Atualiza os dados filtrados pelo período
          }


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
        })
        .catch(error => {
          console.error(error);
        });
    }

  };

  // Remove o filtro da data início e data fim
  const handleRemoverFiltro = () => {
    setFilteredData([]); // Limpa os dados das datas filtradas
    setFilteredOperador([]); // Limpa os dados filtrados pelo nome do operador
    setFilter([]); // Limpa os dados filtrados das data e pelo nome do operador

    // Limpa os campos
    setDataInicial('');
    setDataFinal('');
    setNomeOperador('');

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

  // Função para verificar se o valor contém apenas letras
  const containsOnlyLetters = (value: string) => {
    const regex = /^[A-Za-z]+$/;
    return regex.test(value);
  };

  // Função para lidar com a alteração no campo "Nome do Operador"
  const handleNomeOperadorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Verifica se o novo valor contém apenas letras
    if (containsOnlyLetters(newValue) || newValue === '') {
      setNomeOperador(newValue);
    }
  };

  return (
    <div className="container">
      <h1> EXTRATO BANCÁRIO </h1>
      <div className="filtro">


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
          onChange={handleNomeOperadorChange}
        />


      </div>
      <div className='opcao'>
        <button onClick={handlePesquisarClick}>Pesquisar</button>
        <button onClick={handleRemoverFiltro}>Remover Filtro</button>
      </div>
      <div className='saldos'>
        <span>Saldo total: R$ {saldoTotal.toFixed(2)}</span>
        <span>Saldo no período: R$ {saldoPeriodo.toFixed(2)}</span>
      </div>
      <table className="table">
        <thead>
          <tr>
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
