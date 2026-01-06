# Flow Diagrams

## 1. Sign-Up Flow (Mobile + OTP)

```
[User]                      [Frontend]                      [Backend]                       [DB]
  |                             |                               |                             |
  |--- Enter Mobile Number ---->|                               |                             |
  |                             |--- Request OTP -------------->|                             |
  |                             |                               |--- Generate Mock OTP ------>|
  |                             |<-- Show OTP Input ------------|                             |
  |                             |                               |                             |
  |--- Enter OTP & Details ---->|                               |                             |
  | (Name, DOB, etc.)           |--- Submit Registration ------>|                             |
  |                             |                               |--- Verify OTP               |
  |                             |                               |--- Hash DOB                 |
  |                             |                               |--- Create User ------------>|
  |                             |<-- Success / Token -----------|                             |
  |--- Redirect to Home ------->|                               |                             |
```

## 2. Login Flow (Mobile + DOB) - PRIMARY

```
[User]                      [Frontend]                      [Backend]                       [DB]
  |                             |                               |                             |
  |--- Enter Mobile & DOB ----->|                               |                             |
  |                             |--- Login Request ------------>|                             |
  |                             |                               |--- Find User by Mobile ---->|
  |                             |                               |--- Compare Hash(DOB)        |
  |                             |<-- Auth Token (JWT) ----------|                             |
  |--- Redirect to Dashboard -->|                               |                             |
```

## 3. Booking Flow

```
[User]                      [Frontend]                      [Backend]                       [DB]
  |                             |                               |                             |
  |--- Select Date ------------>|                               |                             |
  |                             |--- Get Availability (Date) -->|                             |
  |                             |                               |--- Find Bookings (Date) --->|
  |                             |<-- Return Occupied Slots -----|                             |
  |--- Select Time Slot ------->|                               |                             |
  |--- Fill Details ----------->|                               |                             |
  |--- Click "Pay & Book" ----->|                               |                             |
  |                             |--- Create Booking (Pending) ->|                             |
  |                             |                               |--- Save Booking ----------->|
  |                             |--- Process Payment (Mock) --->|                             |
  |                             |                               |--- Update Payment Log ----->|
  |                             |                               |--- Update Booking (Conf) -->|
  |                             |<-- Booking Success -----------|                             |
```

## 4. Cancellation Flow

```
[User]                      [Frontend]                      [Backend]                       [DB]
  |                             |                               |                             |
  |--- Click Cancel ----------->|                               |                             |
  |                             |--- Cancel Request (ID) ------>|                             |
  |                             |                               |--- Check Cancellation Rule  |
  |                             |                               |    (Time > 24hrs?)          |
  |                             |                               |--- Calc Refund Amount       |
  |                             |                               |--- Update Status (Canc) --->|
  |                             |                               |--- Log Refund Transaction ->|
  |                             |<-- Success Message -----------|                             |
```
