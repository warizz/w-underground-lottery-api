# api for underground lottery

## required

config.json at project's root/

```
{
  "development": {
    "PORT": 3005,
    "MONGODB_URI": "mongodb://localhost:27017/UndergroundLottery"
  },
  "test": {
    "PORT": 3005,
    "MONGODB_URI": "mongodb://localhost:27017/UndergroundLotteryTest"
  }
}
```

## api

### PATCH /bet/:id
remove bet from /bet and /period

#### url parameters
- id (String)

#### body parameters
- bet (Object)

#### returns
- bet (Object): updated doc

---

### DELETE /bet/:id
remove bet from /bet and /period

#### url parameters
- id (String)

#### body parameters
- null

#### returns
- null

---
