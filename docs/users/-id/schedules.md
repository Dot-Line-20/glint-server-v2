# Schedules

## 일정 생성

```plain
[POST] /users/:userId/schedules
```

### Request

### Parameter

|key|type|description|
|---|---|---|
|userId|number|자연수인 숫자입니다|

#### Body

|key|type|description|
|---|---|---|
|parentScheduleId|number \| null|자연수인 숫자 또는 null입니다|
|name|string|최소 1자 최대 64자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|
|startingAt|string|ISO 8601 Date and time in UTC 형식의 문자열입니다|
|endingAt|string|ISO 8601 Date and time in UTC 형식의 문자열입니다|

### Response

#### 200

```json
{
	"status": "success",
	"data": {
    "id": "<number, positive integer>",
    "userId": "<number, positive integer>",
    "parentScheduleId": "<number or null, positive integer or null>",
    "name": "<string, length 1 to 64>",
    "startingAt": "<string, ISO 8601 Date and time in UTC format>",
    "endingAt": "<string, ISO 8601 Date and time in UTC format>",
    "isSuccess": "<boolean>",
    "createdAt": "<string, ISO 8601 Date and time in UTC format>",
    "categories": {
			"scheduleId": "<number, positive integer>",
			"categoryId": "<number, positive integer>",
			"category": {
					"id": "<number, positive integer>",
					"name": "<string, length 1 to 64>"
			}
		}[]
  }
}
```

#### 400 - 존재하지 않는 상위 일정 아이디

```json
{
  "status": "fail",
  "data": {
    "title": "Invalid parentScheduleId"
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

## 모든 일정

```plain
[GET] /users/:userId/schedules
```

### Request

### Parameter

|key|type|description|
|---|---|---|
|userId|number|자연수인 숫자입니다|

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
    "userId": "<number, positive integer>",
    "parentScheduleId": "<number or null, positive integer or null>",
    "name": "<string, length 1 to 64>",
    "startingAt": "<string, ISO 8601 Date and time in UTC format>",
    "endingAt": "<string, ISO 8601 Date and time in UTC format>",
    "isSuccess": "<boolean>",
    "createdAt": "<string, ISO 8601 Date and time in UTC format>",
    "categories": {
			"scheduleId": "<number, positive integer>",
			"categoryId": "<number, positive integer>",
			"category": {
					"id": "<number, positive integer>",
					"name": "<string, length 1 to 64>"
			}
		}[]
  }[]
}
```

## 일정

```plain
[GET] /users/:userId/schedules/:id
```

### Request

### Parameter

|key|type|description|
|---|---|---|
|userId|number|자연수인 숫자입니다|
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
    "userId": "<number, positive integer>",
    "parentScheduleId": "<number or null, positive integer or null>",
    "name": "<string, length 1 to 64>",
    "startingAt": "<string, ISO 8601 Date and time in UTC format>",
    "endingAt": "<string, ISO 8601 Date and time in UTC format>",
    "isSuccess": "<boolean>",
    "createdAt": "<string, ISO 8601 Date and time in UTC format>",
    "categories": {
			"scheduleId": "<number, positive integer>",
			"categoryId": "<number, positive integer>",
			"category": {
					"id": "<number, positive integer>",
					"name": "<string, length 1 to 64>"
			}
		}[]
  }
}
```

## 일정 수정

```plain
[PATCH] /users/:userId/schedules/:id
```

### Request

|key|type|description|
|---|---|---|
|userId|number|자연수인 숫자입니다|
|id|number|자연수인 숫자입니다|

#### Body

|key|type|description|
|---|---|---|
|parentScheduleId|_number \| null_|자연수인 숫자 또는 null입니다|
|name|_string_|최소 1자 최대 64자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|
|startingAt|_string_|ISO 8601 Date and time in UTC 형식의 문자열입니다|
|endingAt|_string_|ISO 8601 Date and time in UTC 형식의 문자열입니다|
|isSuccess|_boolean_|불리언입니다|

### Response

#### 200

```json
{
  "status": "success",
  "data": {
    "id": "<number, positive integer>",
    "userId": "<number, positive integer>",
    "parentScheduleId": "<number or null, positive integer or null>",
    "name": "<string, length 1 to 64>",
    "startingAt": "<string, ISO 8601 Date and time in UTC format>",
    "endingAt": "<string, ISO 8601 Date and time in UTC format>",
    "isSuccess": "<boolean>",
    "createdAt": "<string, ISO 8601 Date and time in UTC format>",
    "categories": {
			"scheduleId": "<number, positive integer>",
			"categoryId": "<number, positive integer>",
			"category": {
					"id": "<number, positive integer>",
					"name": "<string, length 1 to 64>"
			}
		}[]
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

## 일정 삭제

```plain
[DELETE] /users/:userId/schedules/:id
```

### Request

### Parameter

|key|type|description|
|---|---|---|
|userId|number|자연수인 숫자입니다|
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

## 유저 성공률

```plain
[DELETE] /users/:userId/schedules/successRate
```

### Request

### Parameter

|key|type|description|
|---|---|---|
|userId|number|자연수인 숫자입니다|

### Response

#### 200

```json
{
	"status": "success",
	"data": {
    "successRate": "<number, positive integer and range 0 to 100>"
  }
}
```