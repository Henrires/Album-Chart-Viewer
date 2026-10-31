Current (3)
```json
{
  "type": string, 
  "title": string,
  "artist": string,
  "year": integer,
  "ratedOn": string, 
  "ratedBy": string,
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

2 → 3
```diff
+ "ratedBy": string, // Preferably use Twitter (X) handle, or any username.
```

1 → 2
```diff
+ "ratedOn": string, // ISO 8601 date: YYYY-MM-DD
```