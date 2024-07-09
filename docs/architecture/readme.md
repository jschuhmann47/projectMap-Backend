# Arquitectura de ProjectMap

En el presente documento se describe la arquitectura actual de ProjectMap

## Frontend

Se dispone de una interfaz desktop haciendo uso del framework React.

Se conecta con el backend mediante HTTP.

## Backend

Este módulo consiste en una API REST hecha en el lenguaje TypeScript utilizando el framework Nest, el cual se basa en Node.

Este servicio se divide en submódulos, donde cada uno corresponde a una entidad fuerte del dominio. Por ejemplo, usuarios o proyectos.
Cada uno de ellos posee:

- Controller: es responsable de recibir las requests y de devolver las responses con el frontend
- DTO: contiene tipos de datos para interactuar fácilmente con la base de datos
- Module: es responsable de agrupar las dependencias e inyectarlas donde se requiera
- Service: contiene las funciones de lógica de negocio, interactuando con la base de datos de ser necesario
- Schema: contiene declaraciones de tipos para el uso dentro del servicio

Este módulo recibe las requests del frontend y solicita datos a la base de datos de ser necesario.

## Base de datos

Se dispone de una base de datos NoSQL, de tipo documental, usando MongoDB. La misma se encuentra desplegada en la nube, con un límite en el plan gratuito de 5GB.
