export interface Employee {
  id?: number;
  name: string;
  role: string;
  stateId: number;
  districtId: number;
  cityId: number;
  image?: File;
}