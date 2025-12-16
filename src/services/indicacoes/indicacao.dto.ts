export interface CoAutorDTO {
    type: string; // exemplo: 'vereador'
    autor: string; // nome do co-autor
    iniciativa: string; // exemplo: 'co-autor'
}

export interface IndicacaoDTO {
    autor?: string;
    bairro: string;
    ementa: string;
    arquivos?: string;
    texto: string;
    justificativa: string;
    observacoes: string;
    co_autores?: CoAutorDTO[];
}

export interface EditIndicacaoDTO extends IndicacaoDTO {
    id: string;
}
