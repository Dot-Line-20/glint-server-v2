# Chats

---

## 채팅 생성

```plain
[POST] /chats
```

### Request

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Body

|key|type|description|
|---|---|---|
|name|string|최소 1자 최대 64자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|
|userIds|number[]|자연수로 이루어진 배열입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>",
			"name": "<string, length 1 to 64>",
			"users": {
				"user": {
					"id": "<number, natural number>",
					"email": "<string, email format>",
					"name": "<string, length 1 to 64>",
					"birth": "<string, ISO 8601 Date format>",
					"media": {
						"id": "<number, natural number>",
						"name": "<string, hex encoded and length 128>",
						"type": "<string, length 3>",
						"userId": "<number, natural number>",
						"isImage": "<boolean>",
						"createdAt": "<string, ISO 8601 Date and time in UTC format>"
					}/* | null */,
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}[],
			"createdAt": "<string, ISO 8601 Date and time in UTC format>",
			"_count": {
				"users": "<number, positive number>"
			}
		}
	}
	```

#### 400

- 존재하지 않는 유저
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid userIds"
		}
	}
	```

## 모든 채팅

```plain
[GET] /chats
```

### Request

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Query

|key|type|description|
|---|---|---|
|page[size]|_number_|자연수이며 기본 50입니다|
|page[index]|_number_|양의 정수이며 기본 0입니다|
|page[order]|_'asc' \| 'desc'_|'asc' 또는 'desc'이며 기본 'desc'입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>",
			"name": "<string, length 1 to 64>",
			"users": {
				"user": {
					"id": "<number, natural number>",
					"email": "<string, email format>",
					"name": "<string, length 1 to 64>",
					"birth": "<string, ISO 8601 Date format>",
					"media": {
						"id": "<number, natural number>",
						"name": "<string, hex encoded and length 128>",
						"type": "<string, length 3>",
						"userId": "<number, natural number>",
						"isImage": "<boolean>",
						"createdAt": "<string, ISO 8601 Date and time in UTC format>"
					}/* | null */,
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}[],
			"createdAt": "<string, ISO 8601 Date and time in UTC format>",
			"_count": {
				"users": "<number, positive number>"
			}
		}[]
	}
	```

---

## 채팅 수정

```plain
[PATCH] /chats/:id
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

#### Body

|key|type|description|
|---|---|---|
|name|_string_|최소 1자 최대 64자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|
|userIds|_number[]_|자연수로 이루어진 배열입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>",
			"name": "<string, length 1 to 64>",
			"users": {
				"user": {
					"id": "<number, natural number>",
					"email": "<string, email format>",
					"name": "<string, length 1 to 64>",
					"birth": "<string, ISO 8601 Date format>",
					"media": {
						"id": "<number, natural number>",
						"name": "<string, hex encoded and length 128>",
						"type": "<string, length 3>",
						"userId": "<number, natural number>",
						"isImage": "<boolean>",
						"createdAt": "<string, ISO 8601 Date and time in UTC format>"
					}/* | null */,
					"createdAt": "<string, ISO 8601 Date and time in UTC format>"
				}
			}[],
			"createdAt": "<string, ISO 8601 Date and time in UTC format>",
			"_count": {
				"users": "<number, positive number>"
			}
		}
	}
	```

#### 400

- 유저 수 부족
	```json
	{
		"status": "fail",
		"data": {
			"title": "Lack of userIds"
		}
	}
	```

- 존재하지 않는 유저
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid userIds"
		}
	}
	```

#### 401

- 요청하는 유저와 참여자 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unauthorized user"
		}
	}
	```

---

## 채팅 삭제

```plain
[DELETE] /chats/:id
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|

#### Header

|key|type|description|
|---|---|---|
|Authorization|string|Bearer 타입의 json web token 형식 문자열입니다 (accessToken)|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": null
	}
	```

#### 401

- 요청하는 유저와 참여자 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unauthorized user"
		}
	}
	```