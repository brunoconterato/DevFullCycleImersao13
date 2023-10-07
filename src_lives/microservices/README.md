## Starting backend

### Steps to run

#### 0. Check dependencies (bellow)

#### 1. Navigate to: src_lives/microservices/backend/ticket
```
$ cd src_lives/microservices/backend/ticket
```

#### 2. Start backend server:

```
$ yarn start

``` 

#### 3. (Optional) To run integrity tests (in another terminal):

```
$ npx jest

```

### Dependencies:

#### 1. RabbitMQ
docker latest 3.12 version:
```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
```
Check other available versions: https://registry.hub.docker.com/_/rabbitmq/


Run in local browser:
http://rabbitmq:15672/
