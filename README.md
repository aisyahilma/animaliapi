# Animali API

## REST API Specification

| Endpoint Path  | HTTP Method | Description                              |
| -------------- | ----------- | ---------------------------------------- |
| `/animals`     | `GET`       | Get all animals                          |
| `/animals/:id` | `GET`       | Get animal by ID                         |
| `/animals`     | `POST`      | Create new animal                        |
| `/animals`     | `DELETE`    | Delete all animals                       |
| `/animals/:id` | `DELETE`    | Delete animal by ID                      |
| `/animals/:id` | `PATCH`     | Update animal by ID                      |
| `/animals/:id` | `PUT`       | Update animal by ID, create if not exist |

## Getting Started

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000
