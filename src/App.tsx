import React, { useState } from 'react';
import './App.css';
import './components/card/card.css';
import { Card } from './components/card/card';
import { useBancoData } from './hooks/useBancoData';
import { BancoData } from './interface/BancoData';


function App() {
  const [dataInicialF, setDataInicial] = useState('');
  const [dataFinalF, setDataFinal] = useState('');
  const [nomeOperadorF, setNomeOperador] = useState('');

  // Usando o hook useBancoData para buscar dados da API
  const { data } = useBancoData();

  // Armazena datas filtradas
  const [filteredData, setFilteredData] = useState<BancoData[]>([]);
  const [filteredOperador, setFilteredOperador] = useState<BancoData[]>([]);

  // Função para lidar com o clique no botão "Pesquisar"
  const handlePesquisarClick = () => {
    const dataInicial = `${dataInicialF}T00:00:00`;
    const dataFinal = `${dataFinalF}T23:59:59`;
    
    // Faz uma chamada à API para filtrar por período
    fetch(`http://localhost:8080/por-periodo?dataInicial=${dataInicial}&dataFinal=${dataFinal}`)
      .then(response => response.json())
      .then((data: BancoData[]) => {
        setFilteredData(data);
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
  }

  // Função para renderizar os dados na tabela
  const renderTableData = () => {
    const displayData = filteredOperador.length > 0 ? filteredOperador : (filteredData.length > 0 ? filteredData : (data || []));
    
    // Renderiza a interface do usuário
    return displayData.map((bancoData, index) => (
      <Card
        key={index}
        dataTransferencia={bancoData.dataTransferencia}
        nomeOperadorTransacao={bancoData.nomeOperadorTransacao}
        valor={bancoData.valor}
        tipo={bancoData.tipo}
      />
    ));
  };

  return (
    <div className="container">
      <h1>Banco</h1>
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
    </div>
  );
}

export default App;
