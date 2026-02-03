export interface TeamMember {
  id?: number
  name: string,
  surname: string,
  profilePic: string,
  deleted?: number,
  totalHoursTaught?: number,
  hoursTaughtThisMonth?: number
}
