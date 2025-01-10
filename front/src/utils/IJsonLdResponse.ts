export interface IJsonLdResponseCollection<T> {
  "@context": string;
  "@id": string;
  "@type": string;
  "hydra:member": T;
  "hydra:totalItems": number;
}

export interface ErrorLd extends Error {
  "hydra:title": string;
  "hydra:description": string;
  detail?: string;
}

export interface CustomErrorLd extends ErrorLd {
  instruction: {
    instruction: string;
    complement?: string;
    name: string;
    severity?: string;
    errorMessage?: string;
  };
  id: number;
}

export function isCustomErrorLd(error: any): error is CustomErrorLd {
  return (error as CustomErrorLd).instruction !== undefined;
}
