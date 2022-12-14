# Messages

---

## 모든 메시지

```plain
[GET] /chats/:chatId/messages
```

### Request

#### Parameter

|key|type|description|
|---|---|---|
|chatId|number|자연수인 숫자입니다|

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
|startingId|_number_|자연수인 숫자입니다|

### Response

#### 200

- 성공
	```json
	{
		"status": "success",
		"data": {
			"id": "<number, natural number>",
			"content": "<string, length 1 to 65535>",
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
		}[]
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