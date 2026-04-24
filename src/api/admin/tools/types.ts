export interface GenerateCodeRequest {
  value: string;
  width?: number;
  height?: number;
}

export interface GenerateCodeResponse {
  dataUrl: string;
}
