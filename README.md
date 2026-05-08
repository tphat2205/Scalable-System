# Scalable System Design & Implementation

## Load Balancing + Master-Slave Database Replication

A lightweight scalable backend architecture using:

- **Nginx** as Load Balancer
- **Node.js/Express** API instances
- **MySQL Master-Slave Replication**
- **Docker Compose** for orchestration

---

## Architecture Overview

| Layer | Component | Responsibility |
|---|---|---|
| Entry Point | Nginx Load Balancer | Distributes traffic across API nodes |
| Application | API Node 1 & API Node 2 | Stateless REST API services |
| Database | MySQL Master | Handles write operations |
| Database | MySQL Slave | Handles read operations |

### Key Features

- Round Robin load balancing
- Horizontal API scaling
- Read/Write database splitting
- Automatic fallback to Master DB if Slave fails
- Fault-tolerant API routing
- Fully containerized infrastructure

---

## System Architecture Diagram

<img width="467" height="777" alt="img_1777781005442_edb6f7e4216db8" src="https://github.com/user-attachments/assets/801c731f-d1a0-4ef0-b590-e0c1ad039ae7" />


### Request Flow

1. Client sends requests to `localhost`
2. Nginx forwards traffic to API nodes
3. `POST` requests write to MySQL Master
4. `GET` requests read from MySQL Slave
5. Slave replicates data from Master through binary logs

---

# Project Structure

```bash
Scalable-System/
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
├── mysql/
│   ├── master/
│   │   └── my.cnf
│   └── slave/
│       └── my.cnf
└── api/
    ├── Dockerfile
    ├── package.json
    ├── server.js
    ├── config/
    ├── routes/
    ├── controllers/
    ├── services/
    └── middlewares/
```

---

# Core Configuration

## Nginx Load Balancer

- Round Robin distribution
- Automatic retry on failed API nodes
- Health-aware routing using:
  - `max_fails`
  - `fail_timeout`

---

## MySQL Replication

### Master Node

- Binary logging enabled
- Handles:
  - INSERT
  - UPDATE
  - DELETE

### Slave Node

- Read-only replica
- Handles:
  - SELECT queries
- Synchronizes data from Master automatically

---

## API Read/Write Splitting

| Request Type | Database Target |
|---|---|
| POST / PUT / DELETE | Master DB |
| GET | Slave DB |

### Fallback Mechanism

If the Slave database becomes unavailable:

- API automatically switches reads to Master
- Service remains operational without downtime

---

# Setup Guide

## 1. Start Infrastructure

```bash
docker-compose up --build -d
```

---

## 2. Verify Containers

```bash
docker ps
```

Expected containers:

- nginx-lb
- api-node-1
- api-node-2
- mysql-master
- mysql-slave

---

## 3. Configure Replication

### Access Master

```bash
docker exec -it mysql-master mysql -uroot -proot_password
```

Create:

- Database
- Products table
- Replication user

Retrieve replication coordinates:

```sql
SHOW MASTER STATUS;
```

---

### Access Slave

```bash
docker exec -it mysql-slave mysql -uroot -proot_password
```

Connect Slave to Master:

```sql
CHANGE MASTER TO ...;
START SLAVE;
```

Verify:

```sql
SHOW SLAVE STATUS\G
```

Expected:

```text
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
```

---

# API Testing

## Create Product

```bash
curl -X POST http://localhost/products \
-H "Content-Type: application/json" \
-d '{"name":"Keyboard","price":129.99}'
```

---

## Get Products

```bash
curl http://localhost/products
```

Expected response includes:

```json
{
  "source": "SLAVE_DB",
  "processed_by": "API_Node_1"
}
```

---

# Fault Tolerance Test

## Simulate API Failure

Stop one API node:

```bash
docker stop api-node-1
```

Nginx automatically reroutes all traffic to the healthy node.

Restart:

```bash
docker start api-node-1
```

---

# API Reference

## POST `/products`

Create a product.

### Request

```json
{
  "name": "Mechanical Keyboard",
  "price": 129.99
}
```

### Response

```json
{
  "message": "Product created successfully",
  "processed_by": "API_Node_1"
}
```

---

## GET `/products`

Retrieve all products.

### Response

```json
{
  "data": [],
  "source": "SLAVE_DB",
  "processed_by": "API_Node_2"
}
```

---

# Technologies Used

- Node.js
- Express.js
- MySQL 8
- Nginx
- Docker
- Docker Compose

---

# Highlights

- Scalable architecture
- Stateless services
- Database replication
- Load balancing
- Fault tolerance
- Containerized deployment

---
