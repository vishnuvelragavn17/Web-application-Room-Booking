# Use Cases

## 1. User Actors

### UC-1: Register Account
**Actor**: Guest
**Goal**: Create an account to book the venue.
**Pre-condition**: User has a valid mobile number.
**Main Flow**:
1. User enters Mobile Number.
2. System simulates sending OTP (displayed in console/alert).
3. User enters OTP.
4. User enters Name and Date of Birth (DOB).
5. System hashes DOB and creates account.
6. User is logged in.

### UC-2: Login
**Actor**: Registered User
**Goal**: Access the platform.
**Pre-condition**: Account exists.
**Main Flow**:
1. User enters Mobile Number.
2. User enters DOB.
3. System validates credentials.
4. User is granted access.

### UC-3: Check Availability
**Actor**: User
**Goal**: See if venue is free.
**Main Flow**:
1. User visits Booking Page.
2. User selects a Date.
3. System displays available and booked time slots for that date.

### UC-4: Book Venue
**Actor**: User
**Goal**: Reserve a slot.
**Pre-condition**: Slot is available.
**Main Flow**:
1. User selects Date and Time Slot.
2. User fills Event Type, Attendees, Address.
3. User confirms details.
4. User completes "Advance Payment" (Mock).
5. System confirms booking.

### UC-5: View History / Profile
**Actor**: User
**Goal**: See past and upcoming bookings.
**Main Flow**:
1. User navigates to Profile.
2. System shows list of bookings with status (Confirmed, Cancelled).

### UC-6: Cancel Booking
**Actor**: User
**Goal**: Cancel an upcoming event.
**Pre-condition**: Booking is in future.
**Main Flow**:
1. User selects an upcoming booking.
2. User clicks Cancel.
3. System calculates refund (deducts fee).
4. System updates status to "Cancelled".

## 2. Admin / System Logic (Implicit)

### UC-7: Prevent Double Booking
**Actor**: System
**Trigger**: User attempts to pay/confirm.
**Logic**:
1. Database checks if `{ date, timeSlot, status: "confirmed" }` already exists.
2. If yes, reject the new request.

### UC-8: Notifications
**Actor**: SystemScheduler
**Trigger**: Cron job (daily).
**Logic**:
1. Scan bookings for "Tomorrow" and "Next Week".
2. Send reminder (Mock log).
