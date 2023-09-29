// Interface para definir a estrututra dos dados
export interface BancoData {
    dataTransferencia: Date;
    valor: number; 
    tipo: string;
    nomeOperadorTransacao: string;
}