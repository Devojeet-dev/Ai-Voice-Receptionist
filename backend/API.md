# API Documentation

Base URL: /api

All responses follow this envelope:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

Errors follow:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Business not found",
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

---

## Business

### Mode
GET

### Endpoint
/api/businesses

### Req
```json
{
  "page": 1,
  "limit": 10,
  "name": "Clinic",
  "industry": "Dental",
  "email": "info@clinic.com"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Businesses fetched successfully",
  "data": [
    {
      "id": "cmx123abc",
      "name": "Sunrise Dental Clinic",
      "industry": "Dental",
      "phone": "+1234567890",
      "email": "info@sunrisedental.com",
      "address": "123 Main St",
      "description": "Primary care and cosmetic dentistry",
      "createdAt": "2026-09-14T10:00:00.000Z",
      "updatedAt": "2026-09-14T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/businesses/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Business fetched successfully",
  "data": {
    "id": "cmx123abc",
    "name": "Sunrise Dental Clinic",
    "industry": "Dental",
    "phone": "+1234567890",
    "email": "info@sunrisedental.com",
    "address": "123 Main St",
    "description": "Primary care and cosmetic dentistry",
    "staff": [],
    "services": [],
    "appointments": [],
    "conversations": []
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
POST

### Endpoint
/api/businesses

### Req
```json
{
  "name": "Sunrise Dental Clinic",
  "industry": "Dental",
  "phone": "+1234567890",
  "email": "info@sunrisedental.com",
  "address": "123 Main St",
  "description": "Primary care and cosmetic dentistry"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Business created successfully",
  "data": {
    "id": "cmx123abc",
    "name": "Sunrise Dental Clinic",
    "industry": "Dental",
    "phone": "+1234567890",
    "email": "info@sunrisedental.com",
    "address": "123 Main St",
    "description": "Primary care and cosmetic dentistry",
    "createdAt": "2026-09-14T10:00:00.000Z",
    "updatedAt": "2026-09-14T10:00:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
PUT

### Endpoint
/api/businesses/:id

### Req
```json
{
  "name": "Sunrise Dental Clinic",
  "industry": "Orthodontics",
  "phone": "+1234567999",
  "email": "hello@sunrisedental.com",
  "address": "456 Oak Avenue"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Business updated successfully",
  "data": {
    "id": "cmx123abc",
    "name": "Sunrise Dental Clinic",
    "industry": "Orthodontics",
    "phone": "+1234567999",
    "email": "hello@sunrisedental.com",
    "address": "456 Oak Avenue",
    "updatedAt": "2026-09-14T10:30:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
DELETE

### Endpoint
/api/businesses/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Business deleted successfully",
  "data": null,
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

---

## Staff

### Mode
GET

### Endpoint
/api/staff

### Req
```json
{
  "page": 1,
  "limit": 10,
  "businessId": "cmx123abc",
  "role": "Dentist",
  "isActive": true
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Staff fetched successfully",
  "data": [
    {
      "id": "staff_001",
      "businessId": "cmx123abc",
      "name": "Dr. Sarah Lee",
      "role": "Dentist",
      "bio": "Cosmetic dentist",
      "isActive": true,
      "createdAt": "2026-09-14T10:00:00.000Z",
      "updatedAt": "2026-09-14T10:00:00.000Z",
      "business": {
        "id": "cmx123abc",
        "name": "Sunrise Dental Clinic"
      },
      "services": [],
      "availabilities": []
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/staff/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Staff fetched successfully",
  "data": {
    "id": "staff_001",
    "businessId": "cmx123abc",
    "name": "Dr. Sarah Lee",
    "role": "Dentist",
    "bio": "Cosmetic dentist",
    "isActive": true,
    "business": {
      "id": "cmx123abc",
      "name": "Sunrise Dental Clinic"
    },
    "services": [],
    "availabilities": [],
    "appointments": []
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
POST

### Endpoint
/api/staff

### Req
```json
{
  "businessId": "cmx123abc",
  "name": "Dr. Sarah Lee",
  "role": "Dentist",
  "bio": "Cosmetic dentist",
  "isActive": true
}
```

### Res
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Staff created successfully",
  "data": {
    "id": "staff_001",
    "businessId": "cmx123abc",
    "name": "Dr. Sarah Lee",
    "role": "Dentist",
    "bio": "Cosmetic dentist",
    "isActive": true,
    "createdAt": "2026-09-14T10:00:00.000Z",
    "updatedAt": "2026-09-14T10:00:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
PUT

### Endpoint
/api/staff/:id

### Req
```json
{
  "role": "Senior Dentist",
  "bio": "Senior cosmetic and restorative dentist"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Staff updated successfully",
  "data": {
    "id": "staff_001",
    "businessId": "cmx123abc",
    "name": "Dr. Sarah Lee",
    "role": "Senior Dentist",
    "bio": "Senior cosmetic and restorative dentist",
    "isActive": true,
    "updatedAt": "2026-09-14T10:10:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
DELETE

### Endpoint
/api/staff/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Staff deleted successfully",
  "data": null,
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

---

## Service

### Mode
GET

### Endpoint
/api/services

### Req
```json
{
  "page": 1,
  "limit": 10,
  "businessId": "cmx123abc",
  "name": "Cleaning",
  "isActive": true
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Services fetched successfully",
  "data": [
    {
      "id": "svc_001",
      "businessId": "cmx123abc",
      "name": "Teeth Cleaning",
      "description": "Routine cleaning and polish",
      "durationMinutes": 45,
      "price": "120.00",
      "isActive": true,
      "business": {
        "id": "cmx123abc",
        "name": "Sunrise Dental Clinic"
      },
      "staff": [],
      "appointments": []
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/services/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service fetched successfully",
  "data": {
    "id": "svc_001",
    "businessId": "cmx123abc",
    "name": "Teeth Cleaning",
    "description": "Routine cleaning and polish",
    "durationMinutes": 45,
    "price": "120.00",
    "isActive": true,
    "business": {
      "id": "cmx123abc",
      "name": "Sunrise Dental Clinic"
    },
    "staff": [],
    "appointments": []
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
POST

### Endpoint
/api/services

### Req
```json
{
  "businessId": "cmx123abc",
  "name": "Teeth Cleaning",
  "description": "Routine cleaning and polish",
  "durationMinutes": 45,
  "price": 120,
  "isActive": true
}
```

### Res
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Service created successfully",
  "data": {
    "id": "svc_001",
    "businessId": "cmx123abc",
    "name": "Teeth Cleaning",
    "description": "Routine cleaning and polish",
    "durationMinutes": 45,
    "price": "120.00",
    "isActive": true,
    "createdAt": "2026-09-14T10:00:00.000Z",
    "updatedAt": "2026-09-14T10:00:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
PUT

### Endpoint
/api/services/:id

### Req
```json
{
  "name": "Premium Teeth Cleaning",
  "price": 150,
  "durationMinutes": 60
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service updated successfully",
  "data": {
    "id": "svc_001",
    "businessId": "cmx123abc",
    "name": "Premium Teeth Cleaning",
    "description": "Routine cleaning and polish",
    "durationMinutes": 60,
    "price": "150.00",
    "isActive": true,
    "updatedAt": "2026-09-14T10:15:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
DELETE

### Endpoint
/api/services/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service deleted successfully",
  "data": null,
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

---

## Customer

### Mode
GET

### Endpoint
/api/customers

### Req
```json
{
  "page": 1,
  "limit": 10,
  "name": "John",
  "phone": "+1555",
  "email": "john@example.com"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Customers fetched successfully",
  "data": [
    {
      "id": "cust_001",
      "name": "John Doe",
      "phone": "+15551234567",
      "email": "john@example.com",
      "appointments": [],
      "conversations": []
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/customers/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Customer fetched successfully",
  "data": {
    "id": "cust_001",
    "name": "John Doe",
    "phone": "+15551234567",
    "email": "john@example.com",
    "appointments": [],
    "conversations": []
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
POST

### Endpoint
/api/customers

### Req
```json
{
  "name": "John Doe",
  "phone": "+15551234567",
  "email": "john@example.com"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Customer created successfully",
  "data": {
    "id": "cust_001",
    "name": "John Doe",
    "phone": "+15551234567",
    "email": "john@example.com",
    "createdAt": "2026-09-14T10:00:00.000Z",
    "updatedAt": "2026-09-14T10:00:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
PUT

### Endpoint
/api/customers/:id

### Req
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Customer updated successfully",
  "data": {
    "id": "cust_001",
    "name": "John Smith",
    "phone": "+15551234567",
    "email": "johnsmith@example.com",
    "updatedAt": "2026-09-14T10:20:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
DELETE

### Endpoint
/api/customers/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Customer deleted successfully",
  "data": null,
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

---

## Appointment

### Mode
GET

### Endpoint
/api/appointments

### Req
```json
{
  "page": 1,
  "limit": 10,
  "businessId": "cmx123abc",
  "customerId": "cust_001",
  "staffId": "staff_001",
  "serviceId": "svc_001",
  "status": "BOOKED"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Appointments fetched successfully",
  "data": [
    {
      "id": "appt_001",
      "businessId": "cmx123abc",
      "customerId": "cust_001",
      "staffId": "staff_001",
      "serviceId": "svc_001",
      "startTime": "2026-09-20T10:00:00.000Z",
      "endTime": "2026-09-20T10:45:00.000Z",
      "status": "BOOKED",
      "notes": "Initial consultation",
      "business": {
        "id": "cmx123abc",
        "name": "Sunrise Dental Clinic"
      },
      "customer": {
        "id": "cust_001",
        "name": "John Doe"
      },
      "staff": {
        "id": "staff_001",
        "name": "Dr. Sarah Lee"
      },
      "service": {
        "id": "svc_001",
        "name": "Teeth Cleaning"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/appointments/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Appointment fetched successfully",
  "data": {
    "id": "appt_001",
    "businessId": "cmx123abc",
    "customerId": "cust_001",
    "staffId": "staff_001",
    "serviceId": "svc_001",
    "startTime": "2026-09-20T10:00:00.000Z",
    "endTime": "2026-09-20T10:45:00.000Z",
    "status": "BOOKED",
    "notes": "Initial consultation",
    "business": {
      "id": "cmx123abc",
      "name": "Sunrise Dental Clinic"
    },
    "customer": {
      "id": "cust_001",
      "name": "John Doe"
    },
    "staff": {
      "id": "staff_001",
      "name": "Dr. Sarah Lee"
    },
    "service": {
      "id": "svc_001",
      "name": "Teeth Cleaning"
    }
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/appointments/staff/:staffId

### Req
```json
{
  "page": 1,
  "limit": 10
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Staff appointments fetched successfully",
  "data": [
    {
      "id": "appt_001",
      "staffId": "staff_001",
      "customerId": "cust_001",
      "serviceId": "svc_001",
      "startTime": "2026-09-20T10:00:00.000Z",
      "status": "BOOKED"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/appointments/customer/:customerId

### Req
```json
{
  "page": 1,
  "limit": 10
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Customer appointments fetched successfully",
  "data": [
    {
      "id": "appt_001",
      "customerId": "cust_001",
      "staffId": "staff_001",
      "serviceId": "svc_001",
      "startTime": "2026-09-20T10:00:00.000Z",
      "status": "BOOKED"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/appointments/business/:businessId

### Req
```json
{
  "page": 1,
  "limit": 10
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Business appointments fetched successfully",
  "data": [
    {
      "id": "appt_001",
      "businessId": "cmx123abc",
      "customerId": "cust_001",
      "staffId": "staff_001",
      "serviceId": "svc_001",
      "startTime": "2026-09-20T10:00:00.000Z",
      "status": "BOOKED"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
POST

### Endpoint
/api/appointments

### Req
```json
{
  "businessId": "cmx123abc",
  "customerId": "cust_001",
  "staffId": "staff_001",
  "serviceId": "svc_001",
  "startTime": "2026-09-20T10:00:00.000Z",
  "endTime": "2026-09-20T10:45:00.000Z",
  "status": "BOOKED",
  "notes": "Initial consultation"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Appointment created successfully",
  "data": {
    "id": "appt_001",
    "businessId": "cmx123abc",
    "customerId": "cust_001",
    "staffId": "staff_001",
    "serviceId": "svc_001",
    "startTime": "2026-09-20T10:00:00.000Z",
    "endTime": "2026-09-20T10:45:00.000Z",
    "status": "BOOKED",
    "notes": "Initial consultation",
    "createdAt": "2026-09-14T10:00:00.000Z",
    "updatedAt": "2026-09-14T10:00:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
PUT

### Endpoint
/api/appointments/:id

### Req
```json
{
  "status": "COMPLETED",
  "notes": "Appointment completed successfully"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Appointment updated successfully",
  "data": {
    "id": "appt_001",
    "status": "COMPLETED",
    "notes": "Appointment completed successfully",
    "updatedAt": "2026-09-14T10:35:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
DELETE

### Endpoint
/api/appointments/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Appointment deleted successfully",
  "data": null,
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

---

## Availability

### Mode
GET

### Endpoint
/api/availability

### Req
```json
{
  "page": 1,
  "limit": 10,
  "staffId": "staff_001",
  "dayOfWeek": "MONDAY"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Availability fetched successfully",
  "data": [
    {
      "id": "avail_001",
      "staffId": "staff_001",
      "dayOfWeek": "MONDAY",
      "startTime": "09:00",
      "endTime": "17:00",
      "staff": {
        "id": "staff_001",
        "name": "Dr. Sarah Lee"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/availability/staff/:staffId

### Req
```json
{
  "page": 1,
  "limit": 10
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Staff availability fetched successfully",
  "data": [
    {
      "id": "avail_001",
      "staffId": "staff_001",
      "dayOfWeek": "MONDAY",
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/availability/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Availability record fetched successfully",
  "data": {
    "id": "avail_001",
    "staffId": "staff_001",
    "dayOfWeek": "MONDAY",
    "startTime": "09:00",
    "endTime": "17:00",
    "staff": {
      "id": "staff_001",
      "name": "Dr. Sarah Lee"
    }
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
POST

### Endpoint
/api/availability

### Req
```json
{
  "staffId": "staff_001",
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "17:00"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Availability created successfully",
  "data": {
    "id": "avail_001",
    "staffId": "staff_001",
    "dayOfWeek": "MONDAY",
    "startTime": "09:00",
    "endTime": "17:00",
    "createdAt": "2026-09-14T10:00:00.000Z",
    "updatedAt": "2026-09-14T10:00:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
PUT

### Endpoint
/api/availability/:id

### Req
```json
{
  "dayOfWeek": "TUESDAY",
  "startTime": "10:00",
  "endTime": "18:00"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Availability updated successfully",
  "data": {
    "id": "avail_001",
    "staffId": "staff_001",
    "dayOfWeek": "TUESDAY",
    "startTime": "10:00",
    "endTime": "18:00",
    "updatedAt": "2026-09-14T10:25:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
DELETE

### Endpoint
/api/availability/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Availability deleted successfully",
  "data": null,
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

---

## Conversation

### Mode
GET

### Endpoint
/api/conversations

### Req
```json
{
  "page": 1,
  "limit": 10,
  "businessId": "cmx123abc",
  "customerId": "cust_001"
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Conversations fetched successfully",
  "data": [
    {
      "id": "conv_001",
      "businessId": "cmx123abc",
      "customerId": "cust_001",
      "transcript": "Hello, I would like to book an appointment.",
      "intent": "booking",
      "response": "Sure, I can help you schedule.",
      "metadata": {
        "source": "voice",
        "language": "en"
      },
      "business": {
        "id": "cmx123abc",
        "name": "Sunrise Dental Clinic"
      },
      "customer": {
        "id": "cust_001",
        "name": "John Doe"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/conversations/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Conversation fetched successfully",
  "data": {
    "id": "conv_001",
    "businessId": "cmx123abc",
    "customerId": "cust_001",
    "transcript": "Hello, I would like to book an appointment.",
    "intent": "booking",
    "response": "Sure, I can help you schedule.",
    "metadata": {
      "source": "voice",
      "language": "en"
    },
    "business": {
      "id": "cmx123abc",
      "name": "Sunrise Dental Clinic"
    },
    "customer": {
      "id": "cust_001",
      "name": "John Doe"
    }
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/conversations/customer/:customerId

### Req
```json
{
  "page": 1,
  "limit": 10
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Customer conversations fetched successfully",
  "data": [
    {
      "id": "conv_001",
      "customerId": "cust_001",
      "businessId": "cmx123abc",
      "transcript": "Hello, I would like to book an appointment.",
      "intent": "booking"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
GET

### Endpoint
/api/conversations/business/:businessId

### Req
```json
{
  "page": 1,
  "limit": 10
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Business conversations fetched successfully",
  "data": [
    {
      "id": "conv_001",
      "customerId": "cust_001",
      "businessId": "cmx123abc",
      "transcript": "Hello, I would like to book an appointment.",
      "intent": "booking"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
POST

### Endpoint
/api/conversations

### Req
```json
{
  "businessId": "cmx123abc",
  "customerId": "cust_001",
  "transcript": "Hello, I would like to book an appointment.",
  "intent": "booking",
  "response": "Sure, I can help you schedule.",
  "metadata": {
    "source": "voice",
    "language": "en"
  }
}
```

### Res
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Conversation created successfully",
  "data": {
    "id": "conv_001",
    "businessId": "cmx123abc",
    "customerId": "cust_001",
    "transcript": "Hello, I would like to book an appointment.",
    "intent": "booking",
    "response": "Sure, I can help you schedule.",
    "metadata": {
      "source": "voice",
      "language": "en"
    },
    "createdAt": "2026-09-14T10:00:00.000Z",
    "updatedAt": "2026-09-14T10:00:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
PUT

### Endpoint
/api/conversations/:id

### Req
```json
{
  "intent": "appointment_booking",
  "response": "I have booked your appointment for Friday at 10:00 AM."
}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Conversation updated successfully",
  "data": {
    "id": "conv_001",
    "businessId": "cmx123abc",
    "customerId": "cust_001",
    "intent": "appointment_booking",
    "response": "I have booked your appointment for Friday at 10:00 AM.",
    "updatedAt": "2026-09-14T10:30:00.000Z"
  },
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

### Mode
DELETE

### Endpoint
/api/conversations/:id

### Req
```json
{}
```

### Res
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Conversation deleted successfully",
  "data": null,
  "timestamp": "2026-09-14T12:00:00.000Z"
}
```

---

## Notes

- All list endpoints support pagination via `page` and `limit`.
- Query filters are supported on list endpoints for the relevant fields shown above.
- The app uses Prisma relation inputs such as `business: { connect: { id: ... } }` internally for nested creates/updates.
- In the request examples, the outer IDs are exposed in the JSON body for clarity, while the Prisma layer handles the relation mapping internally.
