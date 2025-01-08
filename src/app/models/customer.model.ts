export interface Customer {
  id?: number
  name: string,
  surname: string,
  homeAddress: string,
  hotel: string,
  hotelRoom: string,
  email: string,
  phoneNumber: string,
  departureDate: string,
  signature: string,
  terms?: number,
  paid: number,
}