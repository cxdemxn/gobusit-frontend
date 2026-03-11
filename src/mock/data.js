// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// Replace API calls in each screen with real fetch/axios calls to your Spring Boot backend.
// These are only used for visual preview in the frontend.

export const mockUser = {
  id: 1,
  firstName: 'Kofi',
  lastName: 'Mensah',
  email: 'kofi@example.com',
  phone: '+22961000001',
  role: 'USER',
  enabled: true,
}

export const mockAdmin = {
  id: 2,
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@gobusit.com',
  phone: '+22961000002',
  role: 'ADMIN',
  enabled: true,
}

export const mockBuses = [
  { id: 1, plateNumber: 'AB-1234-BJ', capacity: 30, status: 'ACTIVE' },
  { id: 2, plateNumber: 'CD-5678-BJ', capacity: 45, status: 'ACTIVE' },
  { id: 3, plateNumber: 'EF-9012-BJ', capacity: 20, status: 'MAINTENANCE' },
]

export const mockRoutes = [
  { id: 1, origin: 'Cotonou', destination: 'Lagos', distanceKm: 125, durationMinutes: 180 },
  { id: 2, origin: 'Cotonou', destination: 'Abuja', distanceKm: 650, durationMinutes: 720 },
  { id: 3, origin: 'Lagos', destination: 'Accra', distanceKm: 485, durationMinutes: 540 },
]

export const mockRoutePoints = [
  { id: 1, routeId: 1, sequence: 1, name: 'Cotonou Terminal', lat: 6.3703, lng: 2.3912 },
  { id: 2, routeId: 1, sequence: 2, name: 'Sème Border', lat: 6.3576, lng: 2.7178 },
  { id: 3, routeId: 1, sequence: 3, name: 'Lagos Mile 2', lat: 6.4698, lng: 3.3232 },
]

export const mockSchedules = [
  {
    id: 1,
    route: mockRoutes[0],
    bus: mockBuses[0],
    departureTime: '2026-03-12T07:00:00',
    arrivalTime: '2026-03-12T10:00:00',
    price: 5000,
    status: 'SCHEDULED',
    totalSeats: 30,
    bookedSeats: 12,
    takenSeats: [1, 3, 5, 7, 8, 10, 12, 15, 18, 22, 25, 28],
  },
  {
    id: 2,
    route: mockRoutes[0],
    bus: mockBuses[1],
    departureTime: '2026-03-12T13:00:00',
    arrivalTime: '2026-03-12T16:00:00',
    price: 5000,
    status: 'BOARDING',
    totalSeats: 45,
    bookedSeats: 44,
    takenSeats: Array.from({ length: 44 }, (_, i) => i + 1),
  },
  {
    id: 3,
    route: mockRoutes[1],
    bus: mockBuses[1],
    departureTime: '2026-03-12T06:00:00',
    arrivalTime: '2026-03-12T18:00:00',
    price: 18000,
    status: 'IN_TRANSIT',
    totalSeats: 45,
    bookedSeats: 30,
    takenSeats: Array.from({ length: 30 }, (_, i) => i + 1),
  },
  {
    id: 4,
    route: mockRoutes[2],
    bus: mockBuses[0],
    departureTime: '2026-03-13T08:00:00',
    arrivalTime: '2026-03-13T17:00:00',
    price: 12000,
    status: 'SCHEDULED',
    totalSeats: 30,
    bookedSeats: 4,
    takenSeats: [2, 9, 14, 21],
  },
]

export const mockTickets = [
  {
    id: 'TK-00123',
    schedule: mockSchedules[0],
    seatNumber: 4,
    price: 5000,
    status: 'BOOKED',
    bookedAt: '2026-03-10T14:22:00',
    passenger: mockUser,
  },
  {
    id: 'TK-00098',
    schedule: mockSchedules[2],
    seatNumber: 11,
    price: 18000,
    status: 'USED',
    bookedAt: '2026-03-08T09:15:00',
    passenger: mockUser,
  },
  {
    id: 'TK-00077',
    schedule: mockSchedules[1],
    seatNumber: 2,
    price: 5000,
    status: 'CANCELLED',
    bookedAt: '2026-03-07T11:00:00',
    passenger: mockUser,
  },
]

export const mockUsers = [
  mockUser,
  mockAdmin,
  { id: 3, firstName: 'Amara', lastName: 'Diallo', email: 'amara@mail.com', phone: '+22961000003', role: 'USER', enabled: true },
  { id: 4, firstName: 'Bayo', lastName: 'Okonkwo', email: 'bayo@mail.com', phone: '+22961000004', role: 'USER', enabled: false },
]

export const mockAllTickets = [
  ...mockTickets,
  {
    id: 'TK-00200',
    schedule: mockSchedules[0],
    seatNumber: 6,
    price: 5000,
    status: 'BOOKED',
    bookedAt: '2026-03-10T16:00:00',
    passenger: mockUsers[2],
  },
]

export const mockStats = {
  totalBuses: mockBuses.length,
  totalRoutes: mockRoutes.length,
  schedulesToday: 2,
  activeBookings: mockAllTickets.filter(t => t.status === 'BOOKED').length,
}
