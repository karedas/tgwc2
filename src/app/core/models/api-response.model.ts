export class ApiResponse {
  private _data: any;
  private _httpCode: number;

  constructor(response: any) {
    this.data = response['data'];
    this.httpCode = response['status'];
  }

  get httpCode(): number {
    return this._httpCode;
  }

  set httpCode(value: number) {
    this._httpCode = value;
  }

  // get success(): boolean {
  //   return this.status === true;
  // }

  // set success(value: boolean) {
  //   this.status = value;
  // }

  get data(): any {
    return this._data;
  }

  set data(value: any) {
    this._data = value;
  }
}
