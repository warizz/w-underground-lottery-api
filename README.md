# underground lottery api
[![Build Status](https://travis-ci.org/warizz/w-underground-lottery-api.svg?branch=master)](https://travis-ci.org/warizz/w-underground-lottery-api)
[![codecov](https://codecov.io/gh/warizz/w-underground-lottery-api/branch/master/graph/badge.svg)](https://codecov.io/gh/warizz/w-underground-lottery-api)

api for [warizz/w-underground-lottery](https://github.com/warizz/w-underground-lottery)

## development instruction

create ```.env``` file in project's root to set up environment variables

```
PORT=xxx
MONGODB_URI=xxx
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
ALLOW_NEW_USER=True||False
```

## usage
### content
- [base url](#base-url)
- [logging in](#logging-in)
- [logging out](#logging-out)
- [get user profile](#get-user-profile)
- [get latest period data](#get-latest-period-data)
- [create new period](#create-new-period)

---

### base url
```
https://w-underground-lottery-api.herokuapp.com/api
```

---

### logging in
```
POST /log_in
```

#### request
* http header

```
{
  "x-access-token": { Facebook's short-lived access token for this app }
}
```

#### successful response
```
HTTP/1.0 200 OK
Content-Type: application/json
{
  "access_token": { Facebook's generated access token  }
}
```

---

### logging out
```
PATCH /log_out
```

#### request
* http header

```
{
  "x-access-token": { Facebook's short-lived access token for this app }
}
```

#### successful response
```
HTTP/1.0 200 OK
```

---

### get user profile
```
GET /me
```

#### request
* http header

```
{
  "x-access-token": { Facebook's short-lived access token for this app }
}
```

#### successful response
```
HTTP/1.0 200 OK
Content-Type: application/json
{
  "id": ObjectId,
  "is_admin": Boolean,
  "name": String,
  "picture": String (URL),
}
```

---

### get latest period data
```
GET /period
```

#### request
* http header

```
{
  "x-access-token": { Facebook's short-lived access token for this app }
}
```

#### successful response id createdAt endedAt isOpen bets result
```
HTTP/1.0 200 OK
Content-Type: application/json
{
  "id": ObjectId,
  "createdAt": Date,
  "endedAt": Date,
  "isOpen": Boolean,
  "bets": [bets],
  "result": { result },
}
```

---

### create new period
```
POST /period
```

#### request
* http header

```
{
  "x-access-token": { Facebook's short-lived access token for this app }
}
```
* request body

```
{
  "endedAt": Date,
}
```

#### successful response
```
HTTP/1.0 201 OK
Content-Type: application/json
{
  "id": ObjectId,
  "createdAt": Date,
  "endedAt": Date,
  "isOpen": Boolean,
}
```

---

### update period
```
PATCH /period
```

#### request
* http header

```
{
  "x-access-token": { Facebook's short-lived access token for this app }
}
```
* request body

```
{
  "bets": [bets],
  "isOpen": Date,
  "result": { result },
}
```

#### successful response
```
HTTP/1.0 200 OK
Content-Type: application/json
{
  "bets": [bets],
  "createdAt": Date,
  "endedAt": Date,
  "id": ObjectId,
  "isOpen": Boolean,
  "result": { result },
}
```
