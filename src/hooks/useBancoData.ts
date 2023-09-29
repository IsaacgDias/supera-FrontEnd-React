
import axios, { AxiosPromise } from "axios" // Axios para fazer chamadas HTTP para a API Spring Boot.
import { BancoData } from "../interface/BancoData"; // Importa a interface BancoData
import { useQuery } from "react-query"; // React Query para gerenciar dados assíncronos

const API_URL = 'http://localhost:8080'; // Url da API

// Função assíncrona para buscar dados da API
const fetchData = async (): AxiosPromise<BancoData[]> => {
    const response = axios.get(API_URL + '/'); // faz a junção com a API_URL
    return response;
}

// Hook personalizado para buscar dados da API
export function useBancoData() {
    // UseQuery é uma função do React Query para buscar dados de forma assíncrona
    const query = useQuery({
        queryFn: fetchData, //Busca os dados
        queryKey: ['banco-data'],  // Identificador único para a consulta
        retry: 2
    })

     // Retorna as propriedades da consulta e simplifica o acesso aos dados
    return {
        ...query,
        data: query.data?.data //simplifica o acesso aos dados da reposta da API
    }
}
