export interface ReferenciasResponseType {
  Codigo: number;
  Mes: string;
}

export interface MarcasResponseType {
  Label: string;
  Value: string;
}

export interface ModelosFullResponseType {
  Anos: [
    {
      Label: string;
      Value: string;
    },
  ];
  Modelos: [
    {
      Label: string;
      Value: number;
    },
  ];
}

export interface ModelosResponseType {
  Label: string;
  Value: number;
}

export interface AnoModelosResponseType {
  Label: string;
  Value: string;
}

export interface AnoModeloResponseType {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  Autenticacao: string;
  TipoVeiculo: number;
  SigaCombustivel: string;
  DataConsulta: string;
}
