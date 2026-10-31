Current (2)
```json
{
  "type": string, 
  "title": string,
  "artist": string,
  "year": integer,
  "ratedOn": string, 
  "coverArt": string, 
  "schemaVersion": integer,
  "tracks": [
    {"position": integer, "name": string, "rating": float},
  ],
  "notes": [
    string
  ]
}
```

---

1 → 2
```diff
+ "ratedOn": string, // ISO 8601 date: YYYY-MM-DD
```