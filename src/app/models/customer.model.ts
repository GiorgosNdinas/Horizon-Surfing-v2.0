export interface Customer {
  id?: number
  name: string,
  surname: string,
  homeAddress: string,
  hotel: string,
  hotelRoom: string,
  email: string,
  activity: string,
  activityType: string,
  insurance: string,
  departureDate: string,
  terms?: number,
  paid: number,
  attachedTeacher?: number
}