# Test Cases / Test Strategy

## 1. Authentication Tests

| ID | Scenario | Input Data | Expected Result |
|----|----------|------------|-----------------|
| AUTH-01 | Valid Registration | Mobile: 9999999999, OTP: 1234, DOB: 01-01-1990 | Success, Token received |
| AUTH-02 | Invalid OTP | Mobile: 9999999999, OTP: 0000 | Error: Invalid OTP |
| AUTH-03 | Duplicate Mobile | Mobile: [Existing], DOB: Any | Error: User already exists |
| AUTH-04 | Valid Login | Mobile: [Existing], DOB: [Correct] | Success, Token received |
| AUTH-05 | Invalid Login | Mobile: [Existing], DOB: [Wrong] | Error: Invalid credentials |

## 2. Booking Tests

| ID | Scenario | Input Data | Expected Result |
|----|----------|------------|-----------------|
| BOOK-01 | View Availability | Date: [Tomorrow] | Returns list of slots (free/booked) |
| BOOK-02 | Successful Booking | Date: [Free], Time: 10-11, Pay: Success | Booking Created, Status: Confirmed |
| BOOK-03 | Double Booking Attempt | Date: [Same], Time: [Same], User 2 | Error: Slot not available |
| BOOK-04 | Booking with Missing Info | Date: [Free], Time: 10-11, Address: Empty | Error: Validation Failed |

## 3. Cancellation Tests

| ID | Scenario | Input Data | Expected Result |
|----|----------|------------|-----------------|
| CANC-01 | Cancel > 24hrs before | BookingID: [Future] | Success, Refund calculated (Fee deducted) |
| CANC-02 | Cancel < 24hrs before | BookingID: [Tomorrow] | Success (Maybe higher fee?) or Blocked (depending on rule) |
| CANC-03 | Cancel Already Cancelled | BookingID: [Cancelled] | Error: Already cancelled |

## 4. API Security Tests

| ID | Scenario | Input Data | Expected Result |
|----|----------|------------|-----------------|
| SEC-01 | Access Protected Route w/o Token | GET /api/bookings | 401 Unauthorized |
| SEC-02 | Access Other User's Profile | GET /api/users/[OtherID] | 403 Forbidden (if implemented strict) |
