# 1
```json
{
  "type": string, // Must be "Album"
  "title": string,
  "artist": string,
  "year": integer,
  "coverArt": string, // URL of the album cover image
  "schemaVersion": integer,
  "tracks": [
    {"position": integer, "name": string, "rating": float},
  ],
  "notes": [
    string
  ]
}
```

# 2
```json
{
  "type": string, // Must be "Album"
  "title": string,
  "artist": string,
  "year": integer,
  "ratedOn": string, // ISO 8601 date: YYYY-MM-DD
  "coverArt": string, // URL of the album cover image
  "schemaVersion": integer,
  "tracks": [
    {"position": integer, "name": string, "rating": float},
  ],
  "notes": [
    string
  ]
}
```