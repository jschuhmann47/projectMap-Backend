# Database Schema Documentation

### Collection Projects
```javascript
const projects = [{
  "projectId": "P1",
  "titulo": "tittle",
  "color": "",
  "descripcion": "",
  "name": "",
  "coordinators": [
    {
      "email": "email1@gmail.com"
    }
  ],
  "participants": [
    {
      "userEmail": "user3@gmail.com",
      "stages": [{
          "id": "st1",
          "permision": "read" // read | write | view
        },
        {
          "id": "st2",
          "permision": "write"
        },
        {
          "id": "st3",
          "permision": "view"
        }]
    }
  ]
}]
```

### Collection User
```javascript
const users = [{
  "firstName": "some_name",
  "lastName": "some_lastname",
  "email": "email@email.com",
  "password": "12345",
  "isAdmin": true | false,
  "projectsId": [] // se usa ?
}]
```