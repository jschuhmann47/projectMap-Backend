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
    ObjectId('669165e35b31e3c8fa676582') // mongo ObjectId
  ],
  "participants": [
    {
      "user": ObjectId('669165e35b31e3c8fa676581'),
      "stages": [{
          "id": "internalSituation",
          "permision": "view" // read |edit | view
        },
        {
          "id": "externalEnvironment",
          "permision": "edit"
        },
        {
          "id": "strategicGuidelines",
          "permision": "hide"
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
  "isAdmin": true | false
}]
```