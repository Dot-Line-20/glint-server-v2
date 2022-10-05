# Users

## 유저 생성

```plain
[POST] /users
```

### Request

#### Body

|key|type|description|
|---|---|---|
|email|string|이메일 형식의 문자열입니다|
|password|string|플레인 텍스트 형식의 문자열입니다|
|name|string|최소 1자 최대 64자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|
|birth|string|ISO 8601 Date 형식의 문자열입니다|

### Response

#### 200

```json
{
	"status": "success",
	"data": {
    "id": "<number, positive integer>",
    "email": "<string, email format>",
    "name": "<string, length 1 to 64>",
    "image": "<string, not decided>",
    "birth": "<string, ISO 8601 Date format>",
    "createdAt": "<string, ISO 8601 Date and time in UTC format>"
  }
}
```

#### 400 - 이미 존재하는 이메일

```json
{
  "status": "fail",
  "data": {
    "title": "Duplicated email"
	}
}
```

## 모든 유저

```plain
[GET] /users
```

### Request

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Query

|key|type|description|
|---|---|---|
|page[size]|_number_|한 페이지의 크기이며 자연수이고 기본 50입니다|
|page[index]|_number_|페이지의 인덱스이며 양의 정수이고 기본 0입니다|
|page[order]|_'asc' \| 'desc'_|페이지의 정렬 방식이며 기본 'desc'입니다|

### Response

#### 200

```json
{
  "status": "success",
  "data": {
    "id": "<number, positive integer>",
    "email": "<string, email format>",
    "name": "<string, length 1 to 64>",
    "image": "<string, not decided>",
    "birth": "<string, ISO 8601 Date format>",
    "createdAt": "<string, ISO 8601 Date and time in UTC format>"
  }[]
}
```

## 유저

```plain
[GET] /users/:id
```

### Request

### Parameter

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

### Response

#### 200

```json
{
  "status": "success",
  "data": {
    "id": "<number, positive integer>",
    "email": "<string, email format>",
    "name": "<string, length 1 to 64>",
    "image": "<string, not decided>",
    "birth": "<string, ISO 8601 Date format>",
    "createdAt": "<string, ISO 8601 Date and time in UTC format>"
  }
}
```

## 유저 수정

```plain
[PATCH] /users/:id
```

### Request

### Parameter

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|

#### Body

|key|type|description|
|---|---|---|
|email|_string_|이메일 형식의 문자열입니다|
|password|_string_|플레인 텍스트 형식의 문자열입니다|
|name|_string_|플레인 텍스트 형식의 문자열입니다|
|birth|_string_|ISO 8601 Date 형식의 문자열입니다|
|image|_string_|아직 미정입니다|

### Response

#### 200

```json
{
	"status": "success",
	"data": {
    "id": "<number, positive integer>",
    "email": "<string, email format>",
    "name": "<string, length 1 to 64>",
    "image": "<string, not decided>",
    "birth": "<string, ISO 8601 Date format>",
    "createdAt": "<string, ISO 8601 Date and time in UTC format>"
  }
}
```

#### 401 - 요청하는 유저와 해당 유저 불일치

```json
{
  "status": "fail",
  "data": {
    "title": "Unauthorized user"
	}
}
```

## 유저 삭제

```plain
[DELETE] /users/:id
```

### Request

### Parameter

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|

### Response

#### 200

```json
{
	"status": "success",
	"data": null
}
```

#### 401 - 요청하는 유저와 해당 유저 불일치

```json
{
  "status": "fail",
  "data": {
    "title": "Unauthorized user"
	}
}
```