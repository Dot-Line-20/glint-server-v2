# Socket.io

---

## 유저 인증

```plain
[EVENT] auth:login
```

### Request

#### Body

|key|type|description|
|---|---|---|
|accessToken|string|json web token 형식 문자열입니다|

### Response

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>"
		}
	}
	```

#### Error

- 토큰 형식 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid accessToken"
		}
	}
	```

---

## 채팅 참여

```plain
[EVENT] chat:join
```

### Request

#### Body

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|

### Response

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>"
		}
	}
	```

#### Error

- 존재하지 않는 채팅
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid chatId"
		}
	}
	```

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

## 채팅 퇴장

```plain
[EVENT] chat:leave
```

### Response

- 성공
	```json
	{
		"status": "success",
		"data": null
	}
	```

---

## 메시지 생성

```plain
[EVENT] message:create
```

### Request

#### Body

|key|type|description|
|---|---|---|
|content|string|최소 1자 최대 65535자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|

### Response

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>",
			"userId": "<number, natural number>",
			"content": "<string, length 1 to 65535>",
			"createdAt": "<string, ISO 8601 Date and time in UTC format>"
		}
	}
	```

#### Error

- 존재하지 않는 채팅
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid chatId"
		}
	}
	```

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

## 메시지 수정

```plain
[EVENT] message:update
```

### Request

#### Body

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|
|content|string|최소 1자 최대 65535자의 길이 제한이 있는 플레인 텍스트 형식의 문자열입니다|

### Response

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>",
			"content": "<string, length 1 to 65535>"
		}
	}
	```

#### Error

- 존재하지 않는 채팅
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid chatId"
		}
	}
	```

- 존재하지 않는 메시지
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid id"
		}
	}
	```

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

## 메시지 삭제

```plain
[EVENT] message:delete
```

### Request

#### Body

|key|type|description|
|---|---|---|
|id|number|자연수인 숫자입니다|

### Response

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>"
		}
	}
	```

#### Error

- 존재하지 않는 채팅
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid chatId"
		}
	}
	```

- 존재하지 않는 메시지
	```json
	{
		"status": "fail",
		"data": {
			"title": "Invalid id"
		}
	}
	```

- 요청하는 유저와 참여자 불일치 또는 요청하는 유저와 발송인 불일치
	```json
	{
		"status": "fail",
		"data": {
			"title": "Unauthorized user"
		}
	}
	```