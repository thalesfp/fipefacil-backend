interface ReferenciasResponseType {
  Codigo: number;
  Mes: string;
}

interface MarcasResponseType {
  Label: string;
  Value: string;
}

interface ModelosFullResponseType {
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

interface ModelosResponseType {
  Label: string;
  Value: number;
}

interface AnoModelosResponseType {
  Label: string;
  Value: string;
}

interface AnoModeloResponseType {
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
