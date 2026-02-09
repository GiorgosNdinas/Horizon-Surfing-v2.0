export interface Activity {
  id?: number,
  customerId: number,
  name: string,
  type: 'lesson' | 'rental' | 'other' | string,

  amount: string,
  teamMemberId: number,

  durationMinutes?: number | null,
  lessonFormat?: 'private' | 'group' | null
}