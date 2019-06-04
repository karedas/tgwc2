export class ApiResponse {
  private _success: boolean;
  private _data: any;
  private _httpCode: number;

  constructor(response: any) {
    this.data = response['data'];
    this.httpCode = response['http_code'];
    this.success = response['success'];
  }

  get httpCode(): number {
    return this._httpCode;
  }

  set httpCode(value: number) {
    this._httpCode = value;
  }

  get success(): boolean {
    return this._success;
  }

  set success(value: boolean) {
    this._success = value;
  }

  get data(): any {
    return this._data;
  }

  set data(value: any) {
    this._data = value;
  }
}
