# GoBusIt — Screen Design Brief

> A complete guide to every screen needed to bring this app to life.
> March 2026

---

## How to Read This Document

GoBusIt is a bus booking system for a single bus company. This document describes every screen the app needs — what goes on it, what the user can do, what data comes from the backend, and what rules the backend enforces that the UI must reflect.

Every screen is tagged with who sees it:

| Tag | Meaning |
|---|---|
| **Both** | Screens seen by everyone — logged in or not |
| **Passenger** | Screens only passengers (regular users) see |
| **Admin** | Screens only admins see — the back-office |

> 💡 The app has two completely separate experiences. A passenger browsing for a trip should feel nothing like an admin managing operations. Design them as two distinct apps that happen to share a login screen.

---

## The System at a Glance

Before designing individual screens, here is how everything connects.

- 🛣 **A ROUTE** is a path between two places. e.g. Cotonou → Lagos. Routes have GPS stop points along the way.
- 🚌 **A BUS** is a physical vehicle with a plate number and a fixed number of seats (capacity).
- 🕒 **A SCHEDULE** is a specific trip: a bus running a route on a particular date and time, at a set price. Passengers book schedules, not routes.
- 🎟 **A TICKET** is a passenger's booking for a specific seat on a specific schedule. One ticket = one seat.

> 💡 The admin creates the infrastructure (buses, routes, schedules). The passenger uses that infrastructure (browses schedules, books seats). These are two completely different jobs.

---

## Part A — Shared Screens

These screens are seen by everyone, regardless of role.

---

### A1 — Welcome / Landing Screen · `Both`

The first thing a user sees when they open the app. It sets the tone for the brand and gives users two clear paths.

**What goes on this screen**
- App name and logo
- A short tagline describing what GoBusIt does
- Two prominent buttons: "Find a Bus" (goes to schedule search) and "Login"
- Optional: a background image or visual that reflects travel/buses

**Important behaviour**
- Unauthenticated users CAN browse schedules — they do not need to login just to look
- Login is only required when they try to book a ticket
- If a user is already logged in, skip this screen and go straight to their home

---

### A2 — Register Screen · `Both`

New users create their account here.

**Form fields**
- First Name
- Last Name
- Email Address
- Phone Number — this is what they will use to log in, not email
- Password
- Confirm Password (UI-only validation — backend does not receive this)

**Behaviour & feedback**
- On success: log the user in automatically and take them to the Passenger Home screen
- If the phone number is already registered: show an error — "An account with this phone number already exists"
- Show a link to the Login screen for users who already have an account
- Password should have a show/hide toggle

> ⚠️ The login identifier is phone number, NOT email. Make this obvious on the form so users don't get confused at login.

---

### A3 — Login Screen · `Both`

Returning users log in here with their phone number and password.

**Form fields**
- Phone Number
- Password

**Behaviour & feedback**
- On success: check the user's role — if ADMIN send to Admin Dashboard, if USER send to Passenger Home
- On wrong credentials: show "Incorrect phone number or password" — do not specify which is wrong
- If account is disabled: show "Your account has been disabled. Please contact support."
- Show a link to Register for users who don't have an account yet
- Password should have a show/hide toggle

---

## Part B — Passenger Screens

These screens make up the passenger experience. The core journey is: browse schedules → view a trip → pick a seat → book → view my tickets.

---

### B1 — Schedule Search / Browse Screen · `Passenger`

The main discovery screen. Passengers use this to find trips. **This screen is accessible WITHOUT being logged in.**

**What goes on this screen**
- Search/filter bar with three optional fields: From (origin), To (destination), Date
- A list of available trip cards below the filters
- Each trip card shows: origin, destination, departure time, arrival time, price, available seats, bus plate number, status badge (SCHEDULED or BOARDING)
- An "Only X seats left" urgency label when available seats is low (suggest 5 or fewer)
- A "Fully Booked" state for when availableSeats reaches 0

**Behaviour**
- All three filters are optional — no filters shows all available trips
- The From and To fields do partial matching — typing "cot" will find "Cotonou"
- Only SCHEDULED and BOARDING trips appear — the backend hides cancelled and completed trips automatically
- Tapping a trip card goes to the Schedule Detail screen (B2)
- If no trips match the search: show an empty state with a friendly message
- Fully booked trips can still be shown but the booking action should be disabled

> 💡 Available seats is a live count. Every time someone books or cancels, this number changes.

---

### B2 — Schedule Detail Screen · `Passenger`

A passenger taps on a trip from the search results and lands here. This is where they see the full details and decide to book.

**What goes on this screen**
- Trip summary: origin → destination, date, departure time, arrival time
- Bus information: plate number
- Price per seat
- Status badge (SCHEDULED / BOARDING / FULL)
- Available seats count with urgency messaging
- Visual seat map of the bus — every seat from 1 to total capacity
  - Greyed-out seats = already taken (the backend sends the exact list of taken seat numbers)
  - Available seats = selectable
- A "Book This Seat" button that activates once the passenger selects an available seat
- Selected seat highlighted in a distinct colour

**Behaviour**
- Passenger taps an available seat — it highlights as selected
- Passenger can change their selection by tapping a different available seat
- Tapping a taken (greyed) seat does nothing — or shows "This seat is taken"
- Tapping "Book This Seat" requires the user to be logged in — if not, redirect to Login screen, then return here after login
- If the schedule is BOARDING, show a subtle urgency message like "This bus is boarding now"
- If the trip is not bookable (IN_TRANSIT, ARRIVED, CANCELLED), hide the booking action entirely and explain why

> ⚠️ The seat map uses two pieces of data: `totalSeats` (how many seats exist) and `takenSeats` (a list of seat numbers already booked e.g. [1, 3, 7]). Render seats 1 through `totalSeats`. Grey out any number in `takenSeats`. The rest are available.

> ⚠️ Two passengers can try to book the same seat at the same time. If a booking fails with a "seat already taken" error after they hit book, show a clear message: "Sorry, seat X was just taken. Please choose another seat." and refresh the seat map.

---

### B3 — Booking Confirmation Screen · `Passenger`

Shown immediately after a successful booking. Gives the passenger confidence their seat is confirmed.

**What goes on this screen**
- A clear success indicator (checkmark, colour, animation)
- Booking summary: trip route, date and time, seat number, price paid
- Ticket ID / reference number
- Status: BOOKED
- Two actions: "View My Tickets" and "Search More Trips"

> 💡 This screen only appears once after booking. It is a transition confirmation — not a permanent screen.

---

### B4 — My Tickets Screen · `Passenger`

The passenger's personal ticket history. Shows all their bookings, newest first.

**What goes on this screen**
- A list of all the passenger's tickets
- Each ticket card shows: origin → destination, departure date and time, seat number, status badge, price
- Status badge colours: BOOKED (blue/active), CANCELLED (red/muted), USED (grey/faded)
- Tapping a ticket goes to the Ticket Detail screen (B5)
- Empty state for passengers who have no tickets yet

**Behaviour**
- Tickets are sorted newest first — most recent booking appears at the top
- BOOKED tickets should stand out visually — these are the active ones the passenger cares about most
- CANCELLED and USED tickets should appear more muted — they are historical records
- Requires login — unauthenticated users should not reach this screen

> 💡 Consider separating tickets into tabs: "Upcoming" (BOOKED) and "Past" (USED + CANCELLED). This is a UI decision — the backend returns all of them and you filter client-side.

---

### B5 — Ticket Detail Screen · `Passenger`

Full details of a single ticket. The passenger comes here to review their booking or cancel it.

**What goes on this screen**
- Ticket reference (ID)
- Route: origin → destination
- Bus plate number
- Departure date and time
- Arrival date and time
- Seat number
- Price paid
- Date and time the booking was made
- Status badge — BOOKED, CANCELLED, or USED
- A "Cancel Ticket" button — only visible when the ticket is BOOKED

**Behaviour**
- If status is BOOKED: show the "Cancel Ticket" button
- If status is USED or CANCELLED: hide the cancel button — show a note explaining the ticket is no longer active
- Tapping "Cancel Ticket" should show a confirmation dialog first: "Are you sure you want to cancel this booking? This cannot be undone."
- On successful cancellation: update the ticket status on screen immediately to CANCELLED, hide the cancel button
- A passenger cannot view or reach the tickets of other passengers

---

### B6 — Passenger Home / Dashboard · `Passenger`

The home screen a passenger lands on after logging in.

**What goes on this screen**
- Greeting with the passenger's first name e.g. "Hello, John"
- A quick search bar or shortcut button to go to Schedule Search (B1)
- A summary of upcoming BOOKED tickets — e.g. "You have 2 upcoming trips"
- Shortcut to My Tickets (B4)
- Navigation to other passenger screens

> 💡 Keep this screen simple. The passenger has two jobs: find trips and manage bookings. Everything on this screen should serve one of those two purposes.

---

## Part C — Admin Screens

These screens make up the admin back-office. Admins manage the infrastructure that passengers use. The admin experience should feel operational and data-dense — this is a management tool, not a consumer app.

---

### C1 — Admin Dashboard · `Admin`

The landing screen after an admin logs in. An at-a-glance view of the operation.

**What goes on this screen**
- Quick stats: total buses, total routes, total schedules today, total active bookings
- Upcoming schedules for today — a compact list showing route, departure time, bus, status, and seat availability
- Quick action buttons: "Add Bus", "Add Route", "Create Schedule"
- Navigation to all admin sections

> 💡 The dashboard is a summary, not a full list. Every item on it should link through to the relevant management screen.

---

### C2 — Bus List Screen · `Admin`

A full list of all buses in the fleet.

**What goes on this screen**
- A table or list of all buses
- Each row: plate number, capacity (seats), status badge (ACTIVE / MAINTENANCE)
- A filter to show only ACTIVE or MAINTENANCE buses
- An "Add Bus" button
- Each row tappable/clickable to go to Bus Detail (C3)

**Bus statuses**

| Status | Meaning |
|---|---|
| ACTIVE | Bus is operational and can be assigned to schedules |
| MAINTENANCE | Bus is under maintenance and cannot be scheduled |

---

### C3 — Bus Detail / Edit Screen · `Admin`

View and edit a single bus. Also where a bus is deleted.

**What goes on this screen**
- Editable fields: plate number, capacity, status
- Save changes button
- Delete bus button (with confirmation dialog)

**Rules to reflect in the UI**
- Plate numbers must be unique — show an error if a duplicate is entered
- Changing a bus to MAINTENANCE does not automatically cancel its schedules — the admin must handle that separately
- Capacity cannot be zero or negative

---

### C4 — Add Bus Screen · `Admin`

A form to create a new bus.

**Form fields**
- Plate Number (required)
- Capacity / Number of Seats (required, must be at least 1)
- Status — default to ACTIVE, option to set MAINTENANCE

---

### C5 — Route List Screen · `Admin`

All routes in the system.

**What goes on this screen**
- A list of all routes
- Each row: origin → destination, distance (km), estimated duration (minutes)
- An "Add Route" button
- Each row tappable to go to Route Detail (C6)

---

### C6 — Route Detail / Edit Screen · `Admin`

View, edit, and manage the stop points for a single route.

**What goes on this screen**
- Editable route fields: origin name, destination name, distance (km), estimated duration (minutes)
- A list of route points (stops along the way) — ordered by sequence number
- Each stop shows: sequence number, stop name, latitude, longitude
- Buttons to add a new stop, edit a stop, delete a stop
- Delete route button (with confirmation — deleting a route deletes all its stops)

**Rules to reflect in the UI**
- The same origin + destination combination cannot exist twice — show an error if a duplicate is attempted
- Two stops on the same route cannot have the same sequence number
- Stops should always display in sequence order — the backend always returns them sorted
- Deleting a route is destructive and permanent — make the confirmation dialog very clear

> 💡 Route points are GPS coordinates with optional stop names. A simple ordered list works well here, but a small map preview is a nice enhancement if feasible.

---

### C7 — Add Route Screen · `Admin`

A form to create a new route. Route points are added after the route is created, on the Route Detail screen.

**Form fields**
- Origin Name (required) — e.g. "Cotonou"
- Destination Name (required) — e.g. "Lagos"
- Distance in km (optional)
- Estimated Duration in minutes (optional)

---

### C8 — Schedule List Screen · `Admin`

All schedules in the system. This is the most important admin screen.

**What goes on this screen**
- A list or table of all schedules
- Each row: route (origin → destination), departure date and time, arrival time, bus plate number, price, status badge, seats booked vs total
- Filters: by route, by status, by date
- A "Create Schedule" button
- Each row tappable to go to Schedule Detail (C9)

**Schedule statuses**

| Status | Meaning |
|---|---|
| SCHEDULED | Trip is planned and open for booking |
| BOARDING | Passengers are currently boarding — still bookable |
| IN_TRANSIT | Bus is on the road — no longer bookable |
| ARRIVED | Trip is complete |
| CANCELLED | Trip was cancelled |

---

### C9 — Schedule Detail / Edit Screen · `Admin`

View, edit, and take action on a single schedule.

**What goes on this screen**
- Route, bus, departure time, arrival time, price, status
- Seat occupancy: seats booked vs total capacity
- Edit fields: any of the above can be updated
- A "Cancel Schedule" action button
- A status change control to update schedule status (SCHEDULED → BOARDING → IN_TRANSIT → ARRIVED)

**Rules to reflect in the UI**
- Departure time must always be before arrival time — validate on the form before submitting
- The selected bus must be ACTIVE — if an admin tries to assign a MAINTENANCE bus, show an error
- The same bus cannot be scheduled for overlapping time windows — show a conflict error
- CANCELLED schedules: hide all edit controls, show a "This schedule has been cancelled" banner
- Cancel button: only show when the schedule is SCHEDULED, BOARDING, or IN_TRANSIT
- Cannot cancel an ARRIVED schedule — that trip is complete
- Show a confirmation dialog before cancelling: "Cancelling this schedule will not automatically cancel passenger tickets. Are you sure?"

> ⚠️ Coming soon: A "Mark as Complete" button will be added that sets the schedule to ARRIVED and automatically marks all passenger tickets as USED. Design this screen with space for that action — it will appear near the Cancel button.

---

### C10 — Create Schedule Screen · `Admin`

A form to create a new trip schedule.

**Form fields**
- Route — dropdown or search selector showing all available routes
- Bus — dropdown selector showing only ACTIVE buses (MAINTENANCE buses are not shown)
- Departure Date and Time — date-time picker
- Arrival Date and Time — date-time picker
- Price — numeric input
- Status — default SCHEDULED

**Rules to reflect in the UI**
- Departure must be before arrival — validate before submitting
- Only show ACTIVE buses in the bus selector
- If bus conflict occurs (overlapping schedule): "This bus is already scheduled during this time. Please choose another bus or adjust the time."

---

### C11 — User Management Screen · `Admin`

A list of all registered users.

**What goes on this screen**
- A list of all users
- Each row: name, email, phone number, role badge (USER / ADMIN), active status badge (Active / Disabled)
- Tapping a user row goes to User Detail (C12)

---

### C12 — User Detail Screen · `Admin`

View and manage a single user. The admin can change their role or disable/enable their account.

**What goes on this screen**
- User's full name, email, phone number
- Current role badge (USER / ADMIN)
- Current account status (Active / Disabled)
- A "Change Role" action — toggles between USER and ADMIN
- A "Disable Account" or "Enable Account" button — toggles based on current state

**Rules to reflect in the UI**
- The "Disable" button should only show when the user is currently Active
- The "Enable" button should only show when the user is currently Disabled
- When an account is disabled, show a clear visual indicator — a banner or red badge
- A disabled user is immediately locked out — their existing token stops working
- Changing a user's role replaces it entirely — a user always has exactly one role
- Show a confirmation before changing role: "This will change this user's access level. Continue?"

> ⚠️ Admins cannot edit a user's personal details (name, phone, email) from this screen. This screen is for access control only.

---

### C13 — Ticket Oversight Screen · `Admin`

The admin's view of all tickets across every user and every schedule.

**What goes on this screen**
- A list/table of all tickets in the system
- Each row: passenger name and email, route (origin → destination), departure date, seat number, booking date, status badge
- Filters: by schedule, by user, by status
- Each row tappable to go to Ticket Detail (C14)

**Ticket statuses**

| Status | Meaning |
|---|---|
| BOOKED | Active booking — passenger has a confirmed seat |
| CANCELLED | Booking was cancelled — seat is freed up |
| USED | Passenger has travelled — trip is complete |

> 💡 This screen will gain pagination in a future backend update. Design the list with a paginator control at the bottom — for now it will show all results, but the UI should be ready for "Page 1 of N" style navigation.

---

### C14 — Ticket Detail Screen (Admin) · `Admin`

Full details of a single ticket, from the admin's perspective.

**What goes on this screen**
- Ticket reference ID
- Passenger: name and email
- Schedule: route, departure time, arrival time
- Bus plate number
- Seat number
- Booking date and time
- Status badge
- A "Cancel Ticket" button — only visible when status is BOOKED

**Rules to reflect in the UI**
- USED tickets: hide the cancel button, show "This ticket has been used"
- CANCELLED tickets: hide the cancel button, show "This ticket has been cancelled"
- Show a confirmation before cancelling: "Cancel this ticket? The seat will be freed and the passenger will lose their booking."

---

## Part D — Universal UI Patterns

These patterns apply across the entire app and should be designed consistently.

### Loading States
- Every screen that fetches data from the backend needs a loading state
- Use skeleton screens or a spinner — do not show empty content while data is loading
- The seat map on the Schedule Detail screen especially needs a loading state

### Empty States
- Schedule search with no results: "No trips found for your search. Try different dates or locations."
- My Tickets with no bookings: "You haven't booked any trips yet. Find a bus to get started."
- Admin lists with no data: appropriate empty state per list

### Error States
- Network errors: "Something went wrong. Please check your connection and try again."
- Seat just taken: "Sorry, that seat was just booked by someone else. Please choose a different seat." — refresh the seat map automatically
- Generic conflict errors: display the specific message returned from the backend — these are always human-readable
- Session expired: redirect to login screen with message "Your session has expired. Please log in again."
- Permission denied: show "You do not have permission to do this"

### Confirmation Dialogs
These actions must always show a confirmation dialog before proceeding:
- Cancel a ticket (passenger)
- Cancel a schedule (admin)
- Delete a bus (admin)
- Delete a route (admin)
- Change a user's role (admin)
- Disable a user account (admin)

### Status Badge Colour Reference

| Status | Suggested Colour | Where it appears |
|---|---|---|
| ACTIVE | Green | Buses |
| MAINTENANCE | Amber | Buses |
| SCHEDULED | Blue | Schedules, search results |
| BOARDING | Teal | Schedules — bus is loading now |
| IN_TRANSIT | Amber | Schedules — bus is on the road |
| ARRIVED | Green | Schedules — trip complete |
| CANCELLED | Red | Schedules, Tickets |
| BOOKED | Blue | Tickets — active booking |
| USED | Grey | Tickets — trip taken, historical |
| Active | Green | User accounts |
| Disabled | Red | User accounts |

### Navigation Structure

**Passenger**
- Home
- Find a Bus (Schedule Search)
- My Tickets
- Profile *(coming soon)*
- Logout

**Admin**
- Dashboard
- Buses
- Routes
- Schedules
- Users
- Tickets
- Logout

---

## Part E — Screens to Design With Flexibility

These features are confirmed coming soon in the backend. Design current screens with room for them.

| Upcoming Feature | What to leave room for |
|---|---|
| **Passenger Profile Screen** | A screen where passengers view and edit their own first name, last name, email, and phone number. Add a "Profile" nav item now even if it links to a placeholder. |
| **Mark Schedule as Complete** | On the Schedule Detail screen (C9), a "Mark as Complete" button will appear alongside the Cancel button. It will set the schedule to ARRIVED and mark all tickets as USED. Leave space for this button. |
| **Structured Error Messages** | Error messages will become richer objects. No UI redesign needed — just ensure every form field has space for an inline error message beneath it. |
| **Pagination on Lists** | Long lists (tickets, users, schedules) will gain pagination. Add a paginator component at the bottom of every list screen now, even if it only shows "Page 1 of 1" for now. |
| **Input Validation Improvements** | Forms will return more specific field-level error messages. Make sure every form field can display an inline error. |

---

## Screen Summary

| ID | Screen Name | Who Sees It |
|---|---|---|
| A1 | Welcome / Landing Screen | Both |
| A2 | Register Screen | Both |
| A3 | Login Screen | Both |
| B1 | Schedule Search / Browse | Passenger |
| B2 | Schedule Detail + Seat Map | Passenger |
| B3 | Booking Confirmation | Passenger |
| B4 | My Tickets List | Passenger |
| B5 | Ticket Detail + Cancel | Passenger |
| B6 | Passenger Home / Dashboard | Passenger |
| C1 | Admin Dashboard | Admin |
| C2 | Bus List | Admin |
| C3 | Bus Detail / Edit | Admin |
| C4 | Add Bus | Admin |
| C5 | Route List | Admin |
| C6 | Route Detail / Edit + Stop Points | Admin |
| C7 | Add Route | Admin |
| C8 | Schedule List | Admin |
| C9 | Schedule Detail / Edit | Admin |
| C10 | Create Schedule | Admin |
| C11 | User Management List | Admin |
| C12 | User Detail / Access Control | Admin |
| C13 | Ticket Oversight List | Admin |
| C14 | Ticket Detail (Admin) | Admin |

**24 screens total — 3 shared · 6 passenger · 14 admin · 1 coming soon (Passenger Profile)**

---

*GoBusIt — Screen Design Brief — March 2026*
