export class ApiResponse {
  
  private _success: boolean;
  private _data: any;
  private _httpCode: number;
  private _status: string;
  private _errors: any;

  constructor(response: any) {
    this.data = response['data'];
    this.httpCode = response['http_code'];
    this.success = response['success'];
    this.status = response['status'];
    this.errors = response['errors'];
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

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get errors(): string {
    return this._errors;
  }

  set errors(value: string) {
    this._errors = value;
  }

  get data(): any {
    return this._data;
  }

  set data(value: any) {
    this._data = value;
  }
}
